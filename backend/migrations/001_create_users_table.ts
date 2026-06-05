import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('phone', 20).unique().notNullable();
    table.string('email', 255).unique();
    table.string('firstName', 100).notNullable();
    table.string('lastName', 100).notNullable();
    table.string('passwordHash', 255).notNullable();
    table.string('avatar').nullable();
    table.enum('kycStatus', ['pending', 'verified', 'rejected']).defaultTo('pending');
    table.string('biometricTemplate').nullable();
    table.boolean('biometricEnabled').defaultTo(false);
    table.integer('loginAttempts').defaultTo(0);
    table.datetime('lockedUntil').nullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
    table.datetime('updatedAt').defaultTo(knex.fn.now());
    table.datetime('deletedAt').nullable();
    table.index('phone');
    table.index('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
