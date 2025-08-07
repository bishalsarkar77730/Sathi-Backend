export const hospitalPlans = {
  basic: {
    type: 'shared',
    dbMode: 'shared',
    migrateTo: null,
  },
  standard: {
    type: 'dedicated',
    dbMode: 'dedicated',
    migrateTo: 'standard',
  },
  premium: {
    type: 'multi-tenant',
    dbMode: 'full-dedicated',
    migrateTo: 'premium',
  },
};

export const personalPlans = {
  basic: {
    dbMode: 'dedicated',
    tieUpLimit: 1,
  },
  standard: {
    dbMode: 'dedicated',
    tieUpLimit: 3,
  },
  premium: {
    dbMode: 'dedicated',
    tieUpLimit: 5,
  },
};
