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
        name: 'all_items',
        source: q.Collection('items'),
      })
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

exports.down = async () => {
  try {
    await client.query(q.Delete(q.Index('all_items')))
  } catch (error) {
    console.error(error)
    throw error
  }
}
