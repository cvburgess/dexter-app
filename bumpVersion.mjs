import fs from "node:fs";
import pkg from "./package.json" with { type: "json" };

const [minor, patch] = pkg.version.split(".");

// Determine new version based on argument
const type = process.argv[2]; // 'minor' or 'patch'
const newVersion =
  type === "minor"
    ? `${parseInt(minor) + 1}.0`
    : `${minor}.${parseInt(patch) + 1}`;

fs.writeFileSync(
  "./package.json",
  JSON.stringify({ ...pkg, version: newVersion }, null, 2),
);

console.log(`Version bumped to ${newVersion}`);
