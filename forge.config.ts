import type { ForgeConfig } from "@electron-forge/shared-types";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "public/app-icon",
    protocols: [{ name: "Dexter", schemes: ["dexter"] }],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-zip",
      config: {},
    },
    // {
    //   name: "@electron-forge/maker-pkg",
    //   config: {},
    // },
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.ts",
          config: "vite.main.config.mjs",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.mjs",
          target: "preload",
        },
      ],
      renderer: [{ name: "main_window", config: "vite.renderer.config.mjs" }],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
