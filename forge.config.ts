import type { ForgeConfig } from "@electron-forge/shared-types";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: "com.dexterplanner",
    appCategoryType: "public.app-category.developer-tools",
    asar: true,
    icon: "public/app-icon",
    name: "Dexter",
    osxSign: {},
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
    protocols: [{ name: "Dexter", schemes: ["dexter"] }],
  },
  makers: [
    {
      name: "@electron-forge/maker-zip", // Used for direct downloads
      config: {},
    },
    // {
    //   name: "@electron-forge/maker-pkg", // Used for Mac App Store
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
          config: "vite.config.mjs",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.config.mjs",
          target: "preload",
        },
      ],
      renderer: [{ name: "main_window", config: "vite.config.mjs" }],
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
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "cvburgess",
          name: "dexter-app",
        },
        prerelease: true,
      },
    },
  ],
};

export default config;
