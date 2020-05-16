import faunadb from 'faunadb'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.FAUNADB_KEY as string

const client = new faunadb.Client({ secret })
const q = faunadb.query

type Noop = () => void
interface Migration {
  timestamp: number
  title: string
  description: string | null
  up: Noop
  down: Noop
}

interface MigrationSet {
  lastRun: string
  migrations?: Migration[]
}

class Store {
  /**
   * Saves the migration data into the database
   */
  async save(set: MigrationSet, cb: Noop) {
    try {
      const hasMigrations = await client.query(
        q.Exists(q.Collection('migrations'))
      )

      if (!hasMigrations) {
        console.log(
          'No "migrations" collection exists in the database. This is common if you are running migrations for the first time. Creating one now...'
        )

        await client.query(q.CreateCollection({ name: 'migrations' }))
      }

      const hasMigration = await client.query(
        q.Exists(q.Ref(q.Collection('migrations'), '1'))
      )

      const migrationsObj = JSON.parse(JSON.stringify(set.migrations))
      if (hasMigration) {
        await client.query(
          q.Replace(q.Ref(q.Collection('migrations'), '1'), {
            data: { lastRun: set.lastRun, migrations: migrationsObj },
          })
        )
      } else {
        await client.query(
          q.Create(q.Ref(q.Collection('migrations'), '1'), {
            data: {
              lastRun: set.lastRun,
              migrations: migrationsObj,
            },
          })
        )
      }

      cb()
    } catch (error) {
      console.error(error)
      cb()
    }
  }

  /**
   * Loads the migrations data from the database
   */
  async load(cb: any) {
    try {
      const hasMigrations = await client.query(
        q.Exists(q.Ref(q.Collection('migrations'), '1'))
      )

      if (!hasMigrations) return cb(null, [])

      const migrations = await client.query(
        q.Select('data', q.Get(q.Ref(q.Collection('migrations'), '1')))
      )

      cb(null, migrations)
    } catch (error) {
      console.error(error)
      cb(error)
    }
  }
}

module.exports = Store
