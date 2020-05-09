// Fixes TS error about --isolatedModules flag
export {}

require('ts-node/register')
require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    extension: 'ts',
  },
}
