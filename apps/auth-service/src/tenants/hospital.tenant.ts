import { createTenantRecord } from '../../../../packages/db/tenant';
import { createTenantDB } from '../../../../packages/db/tenancy.utils';

export async function createHospitalTenant(plan: string, tenantId: string) {
  let dbConfig = null;

  if (['premium', 'standard', 'personal'].includes(plan)) {
    dbConfig = await createTenantDB(tenantId);
  }

  await createTenantRecord({
    id: tenantId,
    name: `tenant_${tenantId}`,
    plan,
    db_config: dbConfig,
  });

  return dbConfig;
}
