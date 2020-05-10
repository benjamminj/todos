import { NextApiHandler } from 'next'
import { db } from '../../src/lib/firebase'

const handler: NextApiHandler = async (req, res) => {
  try {
    let docRef = db.collection('tests').doc('alovelace')

    console.log(docRef)
    let setAda = await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    })

    console.log('SET ADA', setAda)

    let getAda = await (await docRef.get()).data()
    console.log(getAda)

    res.status(200).json(getAda)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default handler
