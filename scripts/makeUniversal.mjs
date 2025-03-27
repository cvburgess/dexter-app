import path from "node:path";

import { makeUniversalApp } from "@electron/universal";

const makePath = (platform) =>
  path.resolve(
    process.cwd(),
    platform ? `out/Dexter-${platform}/Dexter.app` : "out/Dexter.app",
  );

async function createUniversal() {
  await makeUniversalApp({
    x64AppPath: makePath("darwin-x64"),
    arm64AppPath: makePath("darwin-arm64"),
    outAppPath: makePath(),
    mergeASARs: true, // Reduces bundle size by merging ASAR files
  });

  console.log("Universal app created successfully!");
}

createUniversal().catch(console.error);
