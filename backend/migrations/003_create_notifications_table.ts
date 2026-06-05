import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('message').notNullable();
    table.enum('type', ['transaction', 'alert', 'info']).defaultTo('info');
    table.boolean('read').defaultTo(false);
    table.json('data').nullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
    table.datetime('readAt').nullable();
    table.index('userId');
    table.index('read');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('notifications');
}
