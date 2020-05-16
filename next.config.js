require('dotenv').config()

module.exports = {
  target: 'server',
  env: {
    BASE_API_HOST: process.env.PROTOCOL + '://' + process.env.VERCEL_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    FAUNADB_KEY: process.env.FAUNADB_KEY,
  },
  typescript: {
    ignoreDevErrors: true,
  },
}
