import { globalDb } from '../../../../packages/db/knex';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../../../../packages/config/env.config';

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 1. Look up the user in global DB
    const user = await globalDb('users').where({ email }).first();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 3. Identify if it's a personal or tenant user
    const isPersonal = !user.tenant_id;

    let tenantInfo = null;
    if (!isPersonal) {
      // Tenant user (e.g. hospital staff, nurse, lab under hospital)
      const tenant = await globalDb('tenants')
        .where({ hospital_id: user.tenant_id })
        .first();
      if (!tenant) return res.status(500).json({ message: 'Tenant not found' });
      tenantInfo = {
        id: tenant.hospital_id,
        name: tenant.name,
        plan: tenant.plan,
      };
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        isPersonal,
        tenant: tenantInfo,
      },
      config.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return res.status(200).json({ token, user: { name: user.name, role: user.role, tenant: tenantInfo } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
