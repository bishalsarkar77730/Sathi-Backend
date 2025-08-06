import { Response, NextFunction } from 'express';
import { getTenantClient } from '../db/knexClient';
import { getDatabaseNameFromRequest } from '../config/database.config';
import { CustomRequest } from '../types/CustomRequest';
import apiResponse from '../helpers/common/response.common';

export const tenantMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dbName = getDatabaseNameFromRequest(req);
    req.db = getTenantClient(dbName);
    next();
  } catch (err) {
    apiResponse.sendFailed(err, 400, 'Invalid Tenant');
  }
};
