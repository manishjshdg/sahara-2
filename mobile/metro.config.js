const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('fbjs/')) {
    const subpath = moduleName.replace('fbjs/', '');
    let target = path.resolve(__dirname, 'node_modules/fbjs', subpath);
    if (!target.endsWith('.js') && !target.endsWith('.json')) {
      target += '.js';
    }
    return {
      type: 'sourceFile',
      filePath: target,
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
