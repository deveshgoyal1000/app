const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withBlankSplash(config) {
  return withDangerousMod(config, [
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
};
