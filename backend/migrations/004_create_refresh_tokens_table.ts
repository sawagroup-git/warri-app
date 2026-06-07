import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token', 500).notNullable().unique();
    table.datetime('expiresAt').notNullable();
    table.boolean('revoked').defaultTo(false);
    table.datetime('createdAt').defaultTo(knex.fn.now());
    table.index('userId');
    table.index('token');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('refresh_tokens');
}
