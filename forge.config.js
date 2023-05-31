module.exports = {
  packagerConfig: {
    name: "Clipboard translator",
    executableName: "clipboard-translator",
    asar: false,
    appBundleId: "com.godicheol.clipboardtranslator",
    icon: "./assets/icons/icon"
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: "./assets/imgs/background.png",
        format: "ULFO"
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
