const path = require("path");

module.exports = {
  packagerConfig: {
    name: "Clipboard Translator",
    executableName: "clipboard-translator",
    asar: false,
    appBundleId: "com.godicheol.clipboardtranslator",
    icon: "./assets/icons/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: path.resolve(__dirname, "./assets/icons/icon.ico"),
		    iconUrl: path.resolve(__dirname, "./assets/icons/icon.ico"),
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux', 'win32'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: path.resolve(__dirname, "./assets/imgs/background.png"),
        icon: path.resolve(__dirname, './assets/icons/icon.icns'),
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
