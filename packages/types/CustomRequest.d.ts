import { Request } from 'express';
import { Knex } from 'knex';

export interface CustomRequest extends Request {
  db: Knex;
}