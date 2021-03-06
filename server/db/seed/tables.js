/* eslint-disable prettier/prettier */
const { mapQueryPrint, singleQuery } = require('../baseQueries');

// Import schemas
const {
  alterActivityTable,
  alterAttemptingTable,
  alterCommentsTable,
  alterCronActivityTable,
  alterFundingTable,
  alterIssuesTable,
  alterLanguagesTable,
  alterOrganizationsTable,
  alterPaymentTable,
  alterPullRequestsTable,
  alterUsersTable,
  alterWatchingTable,
  alterWithdrawalTable,
  createActivityTable,
  createAttemptingTable,
  createCommentsTable,
  createCronActivityTable,
  createFundingsTable,
  createIssuesTable,
  createLanguagesTable,
  createOrganizationsTable,
  createPaymentsTable,
  createPullRequestsTable,
  createUsersTable,
  createWatchingTable,
  createWithdrawalTable,
} = require('../schemas');

// Alter existing tables
const alterTables = async () => {
  await singleQuery({ queryText: alterActivityTable });
  await singleQuery({ queryText: alterAttemptingTable });
  await singleQuery({ queryText: alterCommentsTable });
  await singleQuery({ queryText: alterCronActivityTable });
  await singleQuery({ queryText: alterFundingTable });
  await singleQuery({ queryText: alterIssuesTable });
  await singleQuery({ queryText: alterLanguagesTable });
  await singleQuery({ queryText: alterOrganizationsTable });
  await singleQuery({ queryText: alterPaymentTable });
  await singleQuery({ queryText: alterPullRequestsTable });
  await singleQuery({ queryText: alterUsersTable });
  await singleQuery({ queryText: alterWatchingTable });
  await singleQuery({ queryText: alterWithdrawalTable });
};

// Create empty tables
const createTables = async () => {
  await singleQuery({ queryText: createActivityTable });
  await singleQuery({ queryText: createAttemptingTable });
  await singleQuery({ queryText: createCommentsTable });
  await singleQuery({ queryText: createCronActivityTable });
  await singleQuery({ queryText: createFundingsTable });
  await singleQuery({ queryText: createIssuesTable });
  await singleQuery({ queryText: createLanguagesTable });
  await singleQuery({ queryText: createOrganizationsTable });
  await singleQuery({ queryText: createPaymentsTable });
  await singleQuery({ queryText: createPullRequestsTable });
  await singleQuery({ queryText: createUsersTable });
  await singleQuery({ queryText: createWatchingTable });
  await singleQuery({ queryText: createWithdrawalTable });
};

// Drop all tables
const dropAllTables = async () => {
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS activity cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS attempting cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS comments cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS cronActivity cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS funding cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS issues cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS languages cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS organizations cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS payments cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS pullRequests cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS users cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS watching cascade' });
  await singleQuery({ queryText: 'DROP TABLE IF EXISTS withdrawal cascade' });
};

// Print all rows in all tables
const printTables = async () => {
  const queryArray = [
    'SELECT * FROM activity',
    'SELECT * FROM attempting',
    'SELECT * FROM comments',
    'SELECT * FROM cronActivity',
    'SELECT * FROM funding',
    'SELECT * FROM issues',
    'SELECT * FROM languages',
    'SELECT * FROM organizations',
    'SELECT * from payments',
    'SELECT * FROM pullRequests',
    'SELECT * FROM users',
    'SELECT * FROM watching',
    'SELECT * FROM withdrawal',
  ];
  await mapQueryPrint(queryArray);
};

module.exports = {
  alterTables,
  createTables,
  dropAllTables,
  printTables,
};
