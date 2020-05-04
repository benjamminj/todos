import knex from 'knex'

export const pg = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI,
})

export const query = (
  query: string,
  parameters: knex.RawBinding[] | knex.ValueDict = {}
) => pg.raw(query, parameters)
