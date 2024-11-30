module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"], // Remove deprecated plugins here
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
