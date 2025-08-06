import knex, { Knex } from 'knex';

const globalDb = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: { min: 2, max: 10 },
});

const tenantConnections: Record<string, Knex> = {};

export async function getTenantDb(hospitalId: string): Promise<Knex> {
  if (tenantConnections[hospitalId]) return tenantConnections[hospitalId];

  const tenant = await globalDb('tenants')
    .where({ hospital_id: hospitalId })
    .first();

  if (!tenant) throw new Error(`Tenant for ${hospitalId} not found`);

  const db = knex({
    client: 'pg',
    connection: {
      host: tenant.db_host,
      port: tenant.db_port,
      database: tenant.db_name,
      user: tenant.db_user,
      password: tenant.db_password,
    },
    pool: { min: 2, max: 10 },
  });

  tenantConnections[hospitalId] = db;
  return db;
}

export { globalDb };
