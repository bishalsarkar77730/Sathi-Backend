import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { createUser, hashPassword } from '../utils/user.utils';
import { createHospitalTenant } from '../tenants/hospital.tenant';
import { migrateTenantPlan } from '../utils/migration.utils';
import { hospitalPlans, personalPlans } from '../configs/plan.config';

type HospitalPlanKey = keyof typeof hospitalPlans;
type PersonalPlanKey = keyof typeof personalPlans;

function isValidHospitalPlan(plan: unknown): plan is HospitalPlanKey {
  return (
    typeof plan === 'string' && ['basic', 'standard', 'premium'].includes(plan)
  );
}

function isValidPersonalPlan(plan: unknown): plan is PersonalPlanKey {
  return (
    typeof plan === 'string' && ['basic', 'standard', 'premium'].includes(plan)
  );
}

export async function signupHandler(req: Request, res: Response) {
  try {
    const {
      email,
      password,
      name,
      role: rawRole,
      signup_type,
      plan,
      hospital_tenant_id,
    } = req.body;

    const role = rawRole?.toLowerCase();

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashed = await hashPassword(password);

    // 🏥 HOSPITAL SIGNUP
    if (role === 'hospital') {
      if (!isValidHospitalPlan(plan)) {
        return res
          .status(400)
          .json({ error: 'Invalid or missing hospital plan' });
      }

      const selectedPlan = hospitalPlans[plan];
      const tenantId = uuid();

      await createHospitalTenant(selectedPlan.dbMode, tenantId);
      await migrateTenantPlan(tenantId, plan);

      const user = await createUser({
        email,
        password: hashed,
        name,
        role: 'hospital',
        tenant_id: tenantId,
        plan,
      });

      return res.status(201).json({
        message: 'Hospital registered',
        tenantId,
        dbMode: selectedPlan.dbMode,
        user,
      });
    }

    // 🧑‍⚕️ DOCTOR SIGNUP
    if (role === 'doctor') {
      if (signup_type === 'personal') {
        if (!isValidPersonalPlan(plan)) {
          return res
            .status(400)
            .json({ error: 'Invalid or missing personal plan' });
        }

        const tenantId = uuid();
        await createHospitalTenant('dedicated', tenantId);
        await migrateTenantPlan(tenantId, plan);

        const user = await createUser({
          email,
          password: hashed,
          name,
          role,
          tenant_id: tenantId,
          signup_type: 'personal',
          plan,
        });

        return res
          .status(201)
          .json({ message: 'Doctor registered (personal)', user });
      } else if (signup_type === 'hospital') {
        if (!hospital_tenant_id) {
          return res.status(400).json({ error: 'Hospital tenant ID required' });
        }

        const user = await createUser({
          email,
          password: hashed,
          name,
          role,
          tenant_id: hospital_tenant_id,
          signup_type: 'hospital',
        });

        return res
          .status(201)
          .json({ message: 'Doctor registered under hospital', user });
      }
    }

    // 🧪 LAB & MEDICAL SIGNUP
    if (['lab', 'medical'].includes(role)) {
      if (signup_type === 'personal') {
        if (!isValidPersonalPlan(plan)) {
          return res
            .status(400)
            .json({ error: 'Invalid or missing personal plan' });
        }

        const tenantId = uuid();
        await createHospitalTenant('dedicated', tenantId);
        await migrateTenantPlan(tenantId, plan);

        const user = await createUser({
          email,
          password: hashed,
          name,
          role,
          tenant_id: tenantId,
          signup_type: 'personal',
          plan,
        });

        return res
          .status(201)
          .json({ message: `${role} registered (personal)`, user });
      } else if (signup_type === 'hospital') {
        if (!hospital_tenant_id) {
          return res.status(400).json({ error: 'Hospital tenant ID required' });
        }

        const user = await createUser({
          email,
          password: hashed,
          name,
          role,
          tenant_id: hospital_tenant_id,
          signup_type: 'hospital',
        });

        return res
          .status(201)
          .json({ message: `${role} registered under hospital`, user });
      }
    }

    // 👩‍⚕️ NURSE SIGNUP
    if (role === 'nurse') {
      if (signup_type === 'personal') {
        if (!isValidPersonalPlan(plan)) {
          return res
            .status(400)
            .json({ error: 'Invalid or missing personal plan' });
        }

        const tenantId = uuid();
        await createHospitalTenant('dedicated', tenantId);
        await migrateTenantPlan(tenantId, plan);

        const user = await createUser({
          email,
          password: hashed,
          name,
          role,
          tenant_id: tenantId,
          signup_type: 'personal',
          plan,
        });

        return res
          .status(201)
          .json({ message: 'Nurse registered (personal)', user });
      } else if (signup_type === 'hospital') {
        if (!hospital_tenant_id) {
          return res.status(400).json({ error: 'Hospital tenant ID required' });
        }

        const user = await createUser({
          email,
          password: hashed,
          name,
          role,
          tenant_id: hospital_tenant_id,
          signup_type: 'hospital',
        });

        return res
          .status(201)
          .json({ message: 'Nurse registered under hospital', user });
      }
    }

    // 🧑‍💼 HRMS SIGNUP
    if (role === 'hrms') {
      if (!hospital_tenant_id) {
        return res
          .status(400)
          .json({ error: 'Hospital tenant ID required for HRMS' });
      }

      const user = await createUser({
        email,
        password: hashed,
        name,
        role: 'hrms',
        tenant_id: hospital_tenant_id,
        signup_type: 'hospital',
      });

      return res
        .status(201)
        .json({ message: 'HRMS registered under hospital', user });
    }

    // 🧍‍♂️ PATIENT SIGNUP
    if (role === 'patient') {
      const user = await createUser({
        email,
        password: hashed,
        name,
        role: 'patient',
        tenant_id: null,
      });

      return res.status(201).json({ message: 'Patient registered', user });
    }

    return res.status(400).json({ error: 'Invalid role or signup_type' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
}
