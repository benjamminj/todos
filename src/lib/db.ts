import knex from 'knex'

export const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI,
})

export const query = (
  query: string,
  parameters: knex.RawBinding[] | knex.ValueDict = {}
) => db.raw(query, parameters).then((res) => res.rows)
