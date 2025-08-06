import { globalDb } from './knex';

interface TenantRecord {
  id: string;
  name: string;
  plan: string;
  db_config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  } | null;
}

export async function createTenantRecord({ id, name, plan, db_config }: TenantRecord) {
  await globalDb('tenants').insert({
    hospital_id: id,
    name,
    plan,
    db_host: db_config?.host ?? null,
    db_port: db_config?.port ?? null,
    db_user: db_config?.user ?? null,
    db_password: db_config?.password ?? null,
    db_name: db_config?.database ?? null,
  });
}
