export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  ignore: [
    'node_modules',
    '**/node_modules/**',
    'src/generated/client' // caso você use um output customizado no schema.prisma
  ]
};