import knex, { Knex } from 'knex';
import { globalDb } from '../../../../packages/db/knex'; // Your existing global/shared DB instance

const tenantDbCache: Record<string, Knex> = {};

export async function getTenantDb(tenantId: string): Promise<Knex> {
  // Return cached connection if exists
  if (tenantDbCache[tenantId]) {
    return tenantDbCache[tenantId];
  }

  // Get tenant DB config from global DB
  const tenant = await globalDb('tenants').where({ hospital_id: tenantId }).first();

  if (!tenant) {
    throw new Error(`No tenant found for ID: ${tenantId}`);
  }

  const connection = {
    host: tenant.db_host,
    port: tenant.db_port,
    user: tenant.db_user,
    password: tenant.db_password,
    database: tenant.db_name,
  };

  const tenantDb = knex({
    client: 'pg',
    connection,
    pool: { min: 2, max: 10 },
  });

  // Cache and return
  tenantDbCache[tenantId] = tenantDb;
  return tenantDb;
}
