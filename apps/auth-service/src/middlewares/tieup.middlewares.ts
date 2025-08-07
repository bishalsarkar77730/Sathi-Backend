import { personalPlans } from '../configs/plan.config';
import { globalDb } from '../../../../packages/db/knex';

type PersonalPlanKey = keyof typeof personalPlans;

export async function canTieUpPersonalUser(userId: string) {
  const user = await globalDb('users').where({ id: userId }).first();
  if (!user) throw new Error('User not found');

  const userPlan = user.plan;

  if (!userPlan || !(userPlan in personalPlans)) {
    throw new Error('Invalid or missing user plan');
  }

  const planDetails = personalPlans[userPlan as PersonalPlanKey];

  const currentTieUps = await globalDb('hospital_tieups').where({
    personal_user_id: userId,
  });

  if (currentTieUps.length >= planDetails.tieUpLimit) {
    throw new Error('Tie-up limit exceeded for your plan');
  }

  return true;
}
