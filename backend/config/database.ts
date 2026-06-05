import knex from 'knex';

const config = {
  development: {
    client: 'postgresql',
    connection: process.env.DB_URL || 'postgresql://postgres:postgres@localhost:5432/wari_app',
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: './migrations',
    },
  },
};

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

export const db = knex(dbConfig);

export default config;
