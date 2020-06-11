import * as faunadb from 'faunadb'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.FAUNADB_KEY as string

const client = new faunadb.Client({ secret })
const q = faunadb.query

exports.up = async () => {
  try {
    await client.query(
      q.CreateIndex({
        name: 'items_by_listId_and_status',
        source: q.Collection('items'),
        terms: [{ field: ['data', 'listId'] }, { field: ['data', 'status'] }],
      })
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

exports.down = async () => {
  try {
    await client.query(q.Delete(q.Index('items_by_listId_and_status')))
  } catch (error) {
    console.error(error)
    throw error
  }
}
