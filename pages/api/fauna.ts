import { NextApiHandler } from 'next'
import faunadb from 'faunadb'

const secret = process.env.FAUNADB_KEY as string

const q = faunadb.query
const client = new faunadb.Client({ secret })

const handler: NextApiHandler = async (req, res) => {
  try {
    // const coll = await client.query(q.CreateCollection({ name: 'test' }))
    // const dbs = await client.query(q.Get(q.Collection('test')))
    // const dbs = await client.query(
    //   q.CreateIndex({
    //     name: 'all_tests',
    //     source: q.Collection('test'),
    //   })
    // )

    // await client.query(q.CreateCollection({ name: 'items' }))

    // const lists = await client.query(
    //   q.Map(
    //     q.Paginate(q.Match(q.Index('all_lists'))),
    //     q.Lambda((ref) => q.Update(ref, { itemRefs: [] }))
    //   )
    // )

    // console.log('LISTS', lists)

    // console.log('STUFF', JSON.stringify(items.data, null, 4))

    // const itemz = await client.query(
    //   q.Map(q.Paginate(q.Match(q.Index('all_tests'))), (ref) =>
    //     q.Select(['ref', '@ref', 'id'], ref)
    //   )
    // )

    // await client.query(
    //   q.Create(q.Collection('test'), { data: { title: 'Some test title!' } })
    // )

    const index = await client.query(
      q.CreateIndex({
        name: 'items_by_listId',
        source: q.Collection('items'),
        terms: [{ field: ['data', 'listId'] }],
      })
    )

    console.log('index', index)

    res.status(200).end()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default handler
