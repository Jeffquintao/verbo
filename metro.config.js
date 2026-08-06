const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Os textos bíblicos (~20MB) são tratados como ASSET, não como módulo JS.
// Assim eles não entram no bundle JavaScript: ficam como arquivos separados
// no app e são lidos sob demanda (ver src/services/bible.ts).
config.resolver.assetExts.push('bible');

// Pelo mesmo motivo, o interlinear grego/hebraico (~24MB, um arquivo por
// livro) é asset — só o livro aberto é lido (ver src/services/originals.ts).
config.resolver.assetExts.push('orig');

module.exports = withNativeWind(config, { input: './src/global.css' });
