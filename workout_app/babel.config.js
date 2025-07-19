module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-react-jsx',
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      plugins: [
        '@babel/plugin-transform-react-jsx',
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }]
      ]
    }
  }
};