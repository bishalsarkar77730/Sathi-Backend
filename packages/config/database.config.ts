import { Request } from 'express';

export const getDatabaseNameFromRequest = (req: Request): string => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId || Array.isArray(tenantId))
    throw new Error('Missing tenant ID');
  return `hospital_${tenantId}`;
};
