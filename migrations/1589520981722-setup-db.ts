import * as faunadb from 'faunadb'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.FAUNADB_KEY as string

const client = new faunadb.Client({ secret })
const q = faunadb.query

exports.up = async () => {
  try {
    await client.query(q.CreateCollection({ name: 'lists' }))
    await client.query(q.CreateCollection({ name: 'items' }))
    await client.query(
      q.CreateIndex({
        name: 'all_lists',
        source: q.Collection('lists'),
      })
    )
    await client.query(
      q.CreateIndex({
        name: 'items_by_listId',
        source: q.Collection('items'),
        terms: [{ field: ['data', 'listId'] }],
      })
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

exports.down = async () => {
  try {
    await client.query(q.Delete(q.Collection('items')))
    await client.query(q.Delete(q.Collection('lists')))
  } catch (error) {
    console.error(error)
    throw error
  }
}
