// scripts/version-check.js
import fs from "node:fs";

// Read versions from files
const prPackage = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const mainPackage = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));

const prVersion = prPackage.version;
const mainVersion = mainPackage.version;

// Compare versions
const hasBeenBumped = prVersion > mainVersion;

if (hasBeenBumped) {
  console.log(
    `Success: PR version (${prVersion}) is greater than main version (${mainVersion})`,
  );
  process.exit(0);
} else {
  console.error(
    `Error: PR version (${prVersion}) is not greater than main version (${mainVersion})`,
  );
  process.exit(1);
}
