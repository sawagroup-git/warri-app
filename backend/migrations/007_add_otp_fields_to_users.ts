import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.string('otpCode', 10).nullable();
    table.datetime('otpExpiresAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('otpCode');
    table.dropColumn('otpExpiresAt');
  });
}
