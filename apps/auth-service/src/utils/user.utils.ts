import bcrypt from 'bcryptjs';
import { globalDb } from '../../../../packages/db/knex';

export async function hashPassword(raw: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(raw, salt);
}

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  role: string;
  tenant_id: string | null;
  plan?: string;
  signup_type?: string;
}

export async function createUser(params: CreateUserParams) {
  const user = {
    email: params.email,
    password: params.password,
    name: params.name,
    role: params.role,
    tenant_id: params.tenant_id,
    plan: params.plan ?? null,
    signup_type: params.signup_type ?? 'personal',
    created_at: new Date(),
  };

  const [created] = await globalDb('users').insert(user).returning('*');
  return created;
}
