import * as Knex from 'knex'

module.exports.up = async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

  await knex.raw(`CREATE TABLE lists (
    id uuid DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    "colorScheme" text,
    PRIMARY KEY (id)
  );`)
}

module.exports.down = async function down(knex: Knex): Promise<any> {
  await knex.raw('DROP TABLE lists;')
}
