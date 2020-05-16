// TODO: fix TS error
import * as faunadb from 'faunadb'

type Noop = () => void

const secret = process.env.FAUNADB_KEY as string

// @ts-ignore
const client = new faunadb.Client({ secret })

module.exports.up = function (next: Noop) {
  next()
}

module.exports.down = function (next: Noop) {
  next()
}
