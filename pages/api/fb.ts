import { NextApiHandler } from 'next'
import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

let db = firebase.firestore()
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

    res.status(200).end()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default handler
