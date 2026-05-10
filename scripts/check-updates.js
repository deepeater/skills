#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const https = require("https");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_REMOTE_BASE = "https://raw.githubusercontent.com/deepeater/team-skills/main";

const args = process.argv.slice(2);
const options = {
  json: args.includes("--json"),
  remote: args.includes("--remote"),
  baseUrl: readFlag("--base-url") || DEFAULT_REMOTE_BASE,
  installRoots: readMultiFlag("--install-root"),
  timeoutMs: Number(readFlag("--timeout-ms") || 10000),
};

if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

function readFlag(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] || null;
}

function readMultiFlag(name) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === name && args[i + 1]) values.push(args[i + 1]);
  }
  return values;
}

function expandHome(input) {
  if (!input) return input;
  if (input === "~") return os.homedir();
  if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
  return input;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function discoverRepoSkills() {
  return fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("deepeater-"))
    .map((entry) => {
      const dir = path.join(REPO_ROOT, entry.name);
      const skillFile = path.join(dir, "SKILL.md");
      const packageFile = path.join(dir, "package.json");
      if (!fs.existsSync(skillFile) || !fs.existsSync(packageFile)) return null;
      const pkg = readJson(packageFile);
      return {
        skill: entry.name,
        packageName: pkg.name || "",
        localSourceVersion: pkg.version || null,
        source: packageFile,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.skill.localeCompare(b.skill));
}

function defaultInstallRoots() {
  const envRoots = process.env.DEEPATER_SKILLS_INSTALL_ROOTS || process.env.DEEPEATER_SKILLS_INSTALL_ROOTS;
  if (envRoots) return envRoots.split(path.delimiter).map(expandHome);
  if (options.installRoots.length > 0) return options.installRoots.map(expandHome);
  return [
    path.join(os.homedir(), ".agents", "skills"),
    path.join(os.homedir(), ".codex", "skills"),
  ];
}

function readInstalledVersion(skill, roots) {
  for (const root of roots) {
    const packageFile = path.join(root, skill, "package.json");
    if (!fs.existsSync(packageFile)) continue;
    const pkg = readJson(packageFile);
    return {
      version: pkg.version || null,
      path: packageFile,
    };
  }
  return {
    version: null,
    path: null,
  };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = https
      .get(url, (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Invalid JSON from ${url}: ${error.message}`));
          }
        });
      })
      .on("error", reject);
    request.setTimeout(options.timeoutMs, () => {
      request.destroy(new Error(`Timed out after ${options.timeoutMs}ms for ${url}`));
    });
  });
}

async function readLatestVersion(skill, fallbackVersion) {
  if (!options.remote) return { version: fallbackVersion, source: "local-repo" };
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/${skill}/package.json`;
  const pkg = await fetchJson(url);
  return { version: pkg.version || null, source: url };
}

function parseVersion(version) {
  if (!version) return null;
  const match = String(version).trim().match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!match) return null;
  return match.slice(1).map((part) => Number(part));
}

function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) return String(a || "").localeCompare(String(b || ""));
  for (let i = 0; i < 3; i += 1) {
    if (left[i] > right[i]) return 1;
    if (left[i] < right[i]) return -1;
  }
  return 0;
}

function statusFor(installedVersion, latestVersion) {
  if (!installedVersion) return "not installed";
  if (!latestVersion) return "unknown latest";
  const comparison = compareVersions(installedVersion, latestVersion);
  if (comparison < 0) return "update available";
  if (comparison > 0) return "local newer";
  return "up to date";
}

function pad(value, width) {
  return String(value || "-").padEnd(width, " ");
}

function printHelp() {
  console.log(`Usage: node scripts/check-updates.js [options]

Checks deepeater skill versions independently.

Options:
  --remote              Compare installed versions against GitHub raw main.
  --base-url <url>      Raw base URL for remote mode.
                        Default: ${DEFAULT_REMOTE_BASE}
  --install-root <dir>  Add an installed skills root. Can be repeated.
  --timeout-ms <ms>     HTTPS timeout for remote mode. Default: 10000.
  --json                Print machine-readable JSON.
  -h, --help            Show help.

Env:
  DEEPEATER_SKILLS_INSTALL_ROOTS  ${path.delimiter}-separated installed skill roots.
`);
}

async function main() {
  const installRoots = defaultInstallRoots();
  const skills = discoverRepoSkills();
  const results = [];

  for (const item of skills) {
    const installed = readInstalledVersion(item.skill, installRoots);
    const latest = await readLatestVersion(item.skill, item.localSourceVersion);
    results.push({
      skill: item.skill,
      packageName: item.packageName,
      installedVersion: installed.version,
      latestVersion: latest.version,
      status: statusFor(installed.version, latest.version),
      installedPath: installed.path,
      latestSource: latest.source,
    });
  }

  if (options.json) {
    console.log(JSON.stringify({ installRoots, results }, null, 2));
    return;
  }

  console.log(`${pad("skill", 18)} ${pad("installed", 12)} ${pad("latest", 12)} status`);
  console.log(`${"-".repeat(18)} ${"-".repeat(12)} ${"-".repeat(12)} ${"-".repeat(18)}`);
  for (const result of results) {
    console.log(
      `${pad(result.skill, 18)} ${pad(result.installedVersion, 12)} ${pad(result.latestVersion, 12)} ${result.status}`,
    );
  }
}

main().catch((error) => {
  console.error(`check-updates failed: ${error.message}`);
  process.exit(1);
});
