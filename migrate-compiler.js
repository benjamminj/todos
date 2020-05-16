module.exports = () => {
  require('esm')(module)
  require('ts-node').register({
    compilerOptions: {
      module: 'commonjs',
    },
  })
}
