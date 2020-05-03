// Fixes TS error about --isolatedModules flag
export {}

require('ts-node/register')
require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: process.env.POSTGRES_URI,
  migrations: {
    extension: 'ts',
  },
}
