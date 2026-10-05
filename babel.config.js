module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@context': './src/context',
          '@theme': './src/theme',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@assets': './src/assets',
        },
      },
    ],
    // ⚠️ Reanimated MUST be last
    'react-native-reanimated/plugin',
  ],
};