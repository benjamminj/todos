require('dotenv').config()

module.exports = {
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  typescript: {
    ignoreDevErrors: true,
  },
}
