import fs from "node:fs";
import pkg from "../package.json" with { type: "json" };

const [minor, patch] = pkg.version.split(".");

// Determine new version based on argument
const type = process.argv[2]; // 'feature' or 'bug/chore/etc'
const newVersion =
  type === "feature"
    ? `${parseInt(minor) + 1}.0`
    : `${minor}.${parseInt(patch) + 1}`;

fs.writeFileSync(
  "./package.json",
  JSON.stringify({ ...pkg, version: newVersion }, null, 2) + "\n",
);

console.log(`Version bumped to ${newVersion}`);
