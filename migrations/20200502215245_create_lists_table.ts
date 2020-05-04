import * as Knex from 'knex'

module.exports.up = async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

  await knex.raw(`
    CREATE TABLE lists (
      id uuid DEFAULT uuid_generate_v4(),
      name text NOT NULL,
      color_scheme text,
      PRIMARY KEY (id)
    );
  `)

  await knex.raw(`
    CREATE TABLE list_items (
      id uuid DEFAULT uuid_generate_v4(),
      list_id uuid NOT NULL,
      name text NOT NULL,
      status text DEFAULT 'todo',
      description text,
      PRIMARY KEY (id, list_id),
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
    );
  `)
}

module.exports.down = async function down(knex: Knex): Promise<any> {
  await knex.raw(`DROP TABLE list_items;`)
  await knex.raw(`DROP TABLE lists;`)
}
