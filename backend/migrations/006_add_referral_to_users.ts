import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.string('referralCode', 10).unique().nullable();
    table.uuid('referredById').nullable().references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('referralCode');
    table.dropColumn('referredById');
  });
}
