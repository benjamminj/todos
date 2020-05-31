/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
require('dotenv').config()
const faunadb = require('faunadb')
const dotenvPlugin = require('cypress-dotenv')

const secret = process.env.FAUNADB_KEY

const q = faunadb.query
const client = new faunadb.Client({ secret })

// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
module.exports = (on, config) => {
  on('task', {
    async clearDatabase() {
      await client.query(
        q.Do(
          q.Map(q.Paginate(q.Match(q.Index('all_lists'))), (ref) =>
            q.Delete(ref)
          ),
          q.Map(q.Paginate(q.Match(q.Index('all_items'))), (ref) =>
            q.Delete(ref)
          )
        )
      )

      return true
    },
  })

  config = dotenvPlugin(config)
  return config
}
