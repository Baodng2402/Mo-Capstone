// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (process.env.EXPO_USE_WATCHMAN === '0') {
  config.resolver.useWatchman = false;
}

module.exports = withNativewind(config);
