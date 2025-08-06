import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function createTenantDB(tenantId: string) {
  const dbName = `tenant_${tenantId}`;
  const dbUser = process.env.DB_USER!;
  const dbPassword = process.env.DB_PASSWORD!;
  const dbHost = process.env.DB_HOST!;
  const dbPort = Number(process.env.DB_PORT!);

  try {
    await execPromise(
      `PGPASSWORD=${dbPassword} createdb -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`,
    );
    const knexfilePath = `packages/db/knexfile.js`;
    await execPromise(
      `PGPASSWORD=${dbPassword} knex migrate:latest --env production-tenant --knexfile ${knexfilePath}`,
    );

    return {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    };
  } catch (err) {
    console.error(`❌ Failed to create tenant DB for ${tenantId}:`, err);
    throw err;
  }
}
