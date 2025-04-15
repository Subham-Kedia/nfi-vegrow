module.exports = (api) => {
  api.cache(true);
  const config = {
    env: {
      production: {
        plugins: [
          ['react-remove-properties', { properties: ['data-test-id'] }],
        ],
      },
    },
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
          targets: {
            node: 'current',
          },
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      ['lodash'],
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
        },
      ],
    ],
  };

  if (process.env.NODE_ENV === 'test') {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        ['@babel/plugin-transform-modules-commonjs', { loose: true }],
      ],
    };
  }
  return {
    ...config,
    plugins: [
      ...config.plugins,
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  };
};
