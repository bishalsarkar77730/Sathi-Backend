import { globalDb } from '../../../../packages/db/knex';
import { getTenantDb } from '../tenants/getTenantDb.tenant';
import { createHospitalTenant } from '../tenants/hospital.tenant';

export async function migrateTenantPlan(hospitalId: string, newPlan: 'basic' | 'standard' | 'premium') {
  const oldTenant = await globalDb('tenants').where({ hospital_id: hospitalId }).first();
  if (!oldTenant) throw new Error('Hospital not found');

  const oldDb = await getTenantDb(hospitalId); // old DB instance (shared or dedicated)
  const newTenantId = hospitalId;

  const db_config = newPlan !== 'basic'
    ? await createHospitalTenant(newPlan, newTenantId)
    : null;

  const users = await oldDb('users').where({ tenant_id: hospitalId });
  const doctors = await oldDb('doctors').where({ tenant_id: hospitalId }).catch(() => []);
  const labs = await oldDb('labs').where({ tenant_id: hospitalId }).catch(() => []);
  const medicals = await oldDb('medicals').where({ tenant_id: hospitalId }).catch(() => []);
  const nurses = await oldDb('nurses').where({ tenant_id: hospitalId }).catch(() => []);
  const hrms = await oldDb('hrms').where({ tenant_id: hospitalId }).catch(() => []);

  // Update global tenant record
  await globalDb('tenants')
    .where({ hospital_id: hospitalId })
    .update({
      db_host: db_config?.host ?? null,
      db_port: db_config?.port ?? null,
      db_user: db_config?.user ?? null,
      db_password: db_config?.password ?? null,
      db_name: db_config?.database ?? null,
      plan: newPlan,
    });

  // Insert into new DB if applicable
  if (newPlan !== 'basic') {
    const newDb = await getTenantDb(hospitalId);
    try {
      await newDb('users').insert(users);
      if (doctors.length) await newDb('doctors').insert(doctors);
      if (labs.length) await newDb('labs').insert(labs);
      if (medicals.length) await newDb('medicals').insert(medicals);
      if (nurses.length) await newDb('nurses').insert(nurses);
      if (hrms.length) await newDb('hrms').insert(hrms);
    } catch (err) {
      console.error('Data migration error:', err);
      throw new Error('Failed to insert data in new DB');
    }
  }

  console.log(`Migration to plan ${newPlan} completed for hospital ${hospitalId}`);
}
