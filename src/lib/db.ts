import knex from 'knex'

console.log('DB CONNECTION CREATED')
export const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 1,
    max: 1,
  },
})

export const query = (
  query: string,
  parameters: knex.RawBinding[] | knex.ValueDict = {}
) => db.raw(query, parameters).then((res) => res.rows)
