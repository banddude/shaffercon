import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const siteDir = process.cwd();
const outputPath = path.join(
  siteDir,
  "app",
  "officeadmin",
  "generated",
  "system-snapshot.json",
);

const homeDir = os.homedir();
const today = new Date();

function fileExists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

function safeStat(targetPath) {
  try {
    return fs.statSync(targetPath);
  } catch {
    return null;
  }
}

function safeRead(targetPath) {
  try {
    return fs.readFileSync(targetPath, "utf8");
  } catch {
    return null;
  }
}

function safeJson(targetPath) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch {
    return null;
  }
}

function ensureDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function shell(cmd, cwd = homeDir) {
  try {
    return execSync(cmd, {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = value >= 10 ? Math.round(value) : value.toFixed(1);
  return `${rounded} ${units[unitIndex]}`;
}

function relativeToHome(targetPath) {
  if (targetPath.startsWith(homeDir)) {
    return `~${targetPath.slice(homeDir.length)}`;
  }
  return targetPath;
}

function basenameLabel(targetPath) {
  return path.basename(targetPath);
}

function readDirectory(targetPath) {
  try {
    return fs.readdirSync(targetPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function parseFrontmatter(content) {
  if (!content?.startsWith("---")) {
    return {};
  }

  const end = content.indexOf("\n---", 3);
  if (end === -1) {
    return {};
  }

  const raw = content.slice(3, end).trim();
  const values = {};

  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (!match) {
      continue;
    }
    values[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }

  return values;
}

function daysSince(dateString) {
  if (!dateString) {
    return null;
  }

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const delta = today.getTime() - parsed.getTime();
  return Math.floor(delta / (1000 * 60 * 60 * 24));
}

function collectDocs() {
  const docsDir = path.join(homeDir, ".aiva", "modules", "docs", "content");
  if (!fileExists(docsDir)) {
    return [];
  }

  return readDirectory(docsDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
      const fullPath = path.join(docsDir, entry.name);
      const content = safeRead(fullPath);
      const frontmatter = parseFrontmatter(content);
      return {
        title: entry.name.replace(/\.md$/, ""),
        status: frontmatter.status || null,
        confidence: frontmatter.confidence || null,
        lastVerified: frontmatter["last-verified"] || null,
        ageDays: daysSince(frontmatter["last-verified"] || null),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function collectRecentMemoryNotes() {
  const memoryDir = path.join(homeDir, "mikeshaffer", "memory");
  if (!fileExists(memoryDir)) {
    return [];
  }

  return readDirectory(memoryDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
      const fullPath = path.join(memoryDir, entry.name);
      const stat = safeStat(fullPath);
      const content = safeRead(fullPath) || "";
      const firstLine = content
        .split("\n")
        .find((line) => line.trim().length > 0 && !line.startsWith("#")) || "";
      return {
        name: entry.name,
        modifiedAt: stat?.mtime?.toISOString?.() || null,
      };
    })
    .sort((a, b) => (b.modifiedAt || "").localeCompare(a.modifiedAt || ""))
    .slice(0, 8);
}

function collectRepos() {
  const repoRoots = [
    {
      name: "AIVA Runtime",
      path: path.join(homeDir, ".aiva"),
      role: "shared runtime host code and state surfaces",
    },
    {
      name: "MikeShaffer",
      path: path.join(homeDir, "mikeshaffer"),
      role: "durable work memory, entities, notes, bids, drafts",
    },
    {
      name: "Shaffercon Site",
      path: path.join(homeDir, "AIVA", "website"),
      role: "public web frontend currently hosting this dashboard route",
    },
  ];

  return repoRoots.map((repo) => {
    const gitDir = path.join(repo.path, ".git");
    const present = fileExists(repo.path) && fileExists(gitDir);
    const branch = present ? shell("git branch --show-current", repo.path) : null;
    const lastCommit = present
      ? shell("git log -1 --pretty=format:'%h %ad %s' --date=short", repo.path)
      : null;
    const statusLines = present
      ? (shell("git status --short", repo.path) || "")
          .split("\n")
          .filter(Boolean)
      : [];

    return {
      name: repo.name,
      role: repo.role,
      present,
      branch,
      dirty: statusLines.length > 0,
      modifiedCount: statusLines.filter((line) => !line.startsWith("??")).length,
      untrackedCount: statusLines.filter((line) => line.startsWith("??")).length,
      lastCommitDate: lastCommit?.split(" ").slice(1, 2)[0] || null,
    };
  });
}

function collectRoots() {
  const roots = [
    {
      name: ".aiva",
      path: path.join(homeDir, ".aiva"),
      purpose: "module system, generated CLIs, shared runtime state",
    },
    {
      name: "mikeshaffer",
      path: path.join(homeDir, "mikeshaffer"),
      purpose: "durable workspace, entities, docs, notes, bids",
    },
    {
      name: ".mempalace",
      path: path.join(homeDir, ".mempalace"),
      purpose: "knowledge graph and vector memory",
    },
    {
      name: ".openclaw",
      path: path.join(homeDir, ".openclaw"),
      purpose: "chat runtime, sessions, cron, plugin ecosystem",
    },
    {
      name: "Stalwart Archive",
      path: "/var/lib/stalwart",
      purpose: "mail archive mirror",
    },
    {
      name: "External Archive",
      path: "/Volumes/MIKES HD",
      purpose: "cold archive and media storage",
    },
  ];

  return roots.map((root) => {
    const stat = safeStat(root.path);
    return {
      name: root.name,
      purpose: root.purpose,
      locationLabel: basenameLabel(root.path),
      present: Boolean(stat),
      kind: stat?.isDirectory?.() ? "directory" : stat?.isFile?.() ? "file" : "missing",
      size: stat?.size ? formatBytes(stat.size) : null,
    };
  });
}

function collectArchives() {
  const items = [
    {
      name: "Google Drive Archive",
      path: "/Volumes/MIKES HD/gws-drive-archive",
      role: "cold archive for Google Workspace Drive content",
    },
    {
      name: "Gmail Takeout",
      path: "/Volumes/MIKES HD/gmail-takeout-2025-11",
      role: "point in time Gmail backup",
    },
    {
      name: "Mail Archive Test",
      path: "/Volumes/MIKES HD/mail-archive-test",
      role: "email archive experimentation surface",
    },
    {
      name: "Stalwart Mail Mirror",
      path: "/var/lib/stalwart",
      role: "live mirrored mail archive",
    },
  ];

  return items.map((item) => {
    const stat = safeStat(item.path);
    const du = fileExists(item.path)
      ? shell(`du -sh "${item.path}" | awk '{print $1}'`)
      : null;

    return {
      name: item.name,
      role: item.role,
      locationLabel: basenameLabel(item.path),
      present: Boolean(stat),
      size: du || null,
    };
  });
}

function collectSourceFiles() {
  const files = [
    {
      label: "System Overview",
      path: path.join(homeDir, ".aiva", "modules", "docs", "content", "SYSTEM-OVERVIEW.md"),
    },
    {
      label: "Memory Map",
      path: path.join(homeDir, ".aiva", "modules", "docs", "content", "MEMORY-MAP.md"),
    },
    {
      label: "Data Sources",
      path: path.join(homeDir, ".aiva", "modules", "docs", "content", "DATA-SOURCES.md"),
    },
    {
      label: "System Requirements",
      path: path.join(homeDir, "mikeshaffer", "SYSTEM_REQUIREMENTS.md"),
    },
    {
      label: "Entity Model Spec",
      path: path.join(homeDir, "mikeshaffer", "ENTITY_MODEL_SPEC.md"),
    },
    {
      label: "Memory Folder",
      path: path.join(homeDir, "mikeshaffer", "memory"),
    },
  ];

  return files.map((file) => ({
    label: file.label,
    locationLabel: basenameLabel(file.path),
    present: fileExists(file.path),
  }));
}

function collectSummary(docs, repos) {
  const modulesDir = path.join(homeDir, ".aiva", "modules");
  const moduleCount = fileExists(modulesDir)
    ? readDirectory(modulesDir).filter((entry) =>
        fileExists(path.join(modulesDir, entry.name, "module.json")),
      ).length
    : null;

  const staleDocs = docs.filter((doc) => doc.ageDays !== null && doc.ageDays > 30).length;
  const repoDirtyCount = repos.filter((repo) => repo.dirty).length;

  return {
    moduleCount,
    docsTracked: docs.length,
    staleDocs,
    dirtyRepos: repoDirtyCount,
    latestMemoryNote: collectRecentMemoryNotes()[0]?.name || null,
  };
}

const docs = collectDocs();
const repos = collectRepos();
const recentNotes = collectRecentMemoryNotes();

const snapshot = {
  generatedAt: new Date().toISOString(),
  generatedFromHost: os.hostname(),
  summary: collectSummary(docs, repos),
  northStar: {
    platform: "officeadmin.io",
    runtime: "AIVA owns orchestration and shared runtime state",
    memory: "MemPalace owns long term graph memory",
    workspace: "mikeshaffer owns durable work memory and entity docs",
    note: "This page is generated from files and code the local build can actually see.",
  },
  authorityMap: [
    {
      domain: "Identity",
      authority: "Apple Contacts",
      mirror: "mikeshaffer entity links, identity bridge",
      notes: "Contacts anchors people and orgs, entity folders hold work state.",
    },
    {
      domain: "Live email",
      authority: "Gmail",
      mirror: "Stalwart archive and exports",
      notes: "Archive is not the live source of truth.",
    },
    {
      domain: "Team docs",
      authority: "Google Drive, current state",
      mirror: "cold archive on AIVA storage",
      notes: "Current recommendation is keep live collaboration there until intentional migration.",
    },
    {
      domain: "Durable work memory",
      authority: "mikeshaffer repo",
      mirror: "GitHub history and backups",
      notes: "Bids, notes, summaries, drafts, entity work records belong here.",
    },
    {
      domain: "Long term recall",
      authority: "MemPalace",
      mirror: "docs and extracted notes reference it",
      notes: "AIVA wraps and queries it, OpenClaw feeds it through sessions.",
    },
  ],
  roots: collectRoots(),
  repos,
  archives: collectArchives(),
  docs: docs
    .sort((a, b) => {
      const aAge = a.ageDays ?? -1;
      const bAge = b.ageDays ?? -1;
      return bAge - aAge;
    })
    .slice(0, 12),
  recentNotes,
  sourceFiles: collectSourceFiles(),
};

ensureDir(outputPath);

const existingSnapshot = safeJson(outputPath);
const hasLiveLocalData = snapshot.sourceFiles.some((file) => file.present);

if (!hasLiveLocalData && existingSnapshot) {
  fs.writeFileSync(outputPath, `${JSON.stringify(existingSnapshot, null, 2)}\n`);
  console.log(`officeadmin snapshot preserved at ${outputPath}`);
} else {
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`officeadmin snapshot generated at ${outputPath}`);
}
