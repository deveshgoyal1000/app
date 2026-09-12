const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withBlankSplash(config) {
  // Android Mod
  config = withDangerousMod(config, [
    'android',
    (config) => {
      const resDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res');
      const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      if (fs.existsSync(resDir)) {
        const folders = fs.readdirSync(resDir);
        folders.forEach(folder => {
          if (folder.startsWith('drawable') || folder.startsWith('mipmap')) {
            const logoPath = path.join(resDir, folder, 'splashscreen_logo.png');
            if (fs.existsSync(logoPath)) {
              fs.writeFileSync(logoPath, transparentPng);
            }
          }
        });
      }
      return config;
    },
  ]);

  // iOS Mod
  config = withDangerousMod(config, [
    'ios',
    (config) => {
      const projectName = config.modRequest.projectName;
      const imagesetDir = path.join(config.modRequest.platformProjectRoot, projectName, 'Images.xcassets', 'SplashScreen.imageset');
      const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      
      if (fs.existsSync(imagesetDir)) {
        const files = fs.readdirSync(imagesetDir);
        files.forEach(file => {
          if (file.endsWith('.png')) {
            const logoPath = path.join(imagesetDir, file);
            fs.writeFileSync(logoPath, transparentPng);
          }
        });
      }
      return config;
    },
  ]);

  return config;
};
