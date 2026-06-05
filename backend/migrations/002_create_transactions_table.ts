import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('senderId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('recipientPhone', 20).notNullable();
    table.string('recipientName').nullable();
    table.integer('amount').notNullable();
    table.string('currency', 3).defaultTo('XOF');
    table.integer('fee').notNullable();
    table.enum('provider', ['orange_money', 'mtn_money', 'moov_money', 'wave']).notNullable();
    table.enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled']).defaultTo('pending');
    table.string('reference', 20).unique().notNullable();
    table.text('description').nullable();
    table.text('providerTransactionId').nullable();
    table.text('errorMessage').nullable();
    table.datetime('createdAt').defaultTo(knex.fn.now());
    table.datetime('updatedAt').defaultTo(knex.fn.now());
    table.datetime('completedAt').nullable();
    table.index('senderId');
    table.index('status');
    table.index('createdAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions');
}
