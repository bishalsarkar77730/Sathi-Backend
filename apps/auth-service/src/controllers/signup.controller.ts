import { Request, Response } from 'express';
import { createHospitalTenant } from '../tenants/hospital.tenant';
import { v4 as uuid } from 'uuid';
import { createUser, hashPassword } from '../utils/user.utils';

export async function signupHandler(req: Request, res: Response) {
  const { email, password, name, role, signup_type, plan } = req.body;
  const hashed = await hashPassword(password);

  if (role === 'hospital') {
    const tenantId = uuid();
    await createHospitalTenant(plan, tenantId);
    const user = await createUser({
      email,
      password: hashed,
      name,
      role: 'hospital',
      tenant_id: tenantId,
      plan,
    });

    return res
      .status(201)
      .json({ message: 'Hospital registered', tenantId, user });
  } else if (role === 'doctor') {
    const user = await createUser({
      email,
      password: hashed,
      name,
      role: 'doctor',
      tenant_id: null, // always personal
      signup_type: 'personal',
    });

    return res.status(201).json({ message: 'Doctor registered', user });
  } else if (['lab', 'medical'].includes(role)) {
    if (signup_type === 'personal') {
      const tenantId = uuid();
      await createHospitalTenant('personal', tenantId);

      const user = await createUser({
        email,
        password: hashed,
        name,
        role,
        tenant_id: tenantId,
        signup_type,
      });

      return res
        .status(201)
        .json({ message: `${role} registered`, user, tenantId });
    } else if (signup_type === 'hospital') {
      // Validate plan & attach to hospital tenant
      // Skip DB creation
      const user = await createUser({
        email,
        password: hashed,
        name,
        role,
        tenant_id: req.body.hospital_tenant_id,
        signup_type,
      });

      return res.status(201).json({ message: `${role} under hospital`, user });
    }
  } else if (role === 'patient') {
    const user = await createUser({
      email,
      password: hashed,
      name,
      role,
      tenant_id: null,
    });

    return res.status(201).json({ message: 'Patient registered', user });
  }

  return res.status(400).json({ error: 'Invalid role or flow' });
}
