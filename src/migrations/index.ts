import * as migration_20261115_003336_initial_postgres from './20261115_003336_initial_postgres';

export const migrations = [
  {
    up: migration_20261115_003336_initial_postgres.up,
    down: migration_20261115_003336_initial_postgres.down,
    name: '20261115_003336_initial_postgres'
  },
];
