const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Os textos bíblicos (~20MB) são tratados como ASSET, não como módulo JS.
// Assim eles não entram no bundle JavaScript: ficam como arquivos separados
// no app e são lidos sob demanda (ver src/services/bible.ts).
config.resolver.assetExts.push('bible');

module.exports = withNativeWind(config, { input: './src/global.css' });
