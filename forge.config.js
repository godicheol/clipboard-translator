module.exports = {
  packagerConfig: {
    name: "Electon Application Builder",
    executableName: "electron-application-builder",
    asar: false,
    appBundleId: "com.godicheol.electronapplicationbuilder",
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
