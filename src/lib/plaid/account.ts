import { AccountType } from 'plaid';

//https://plaid.com/docs/api/accounts/#account-type-schema
export const supported_account_types: ReadonlySet<AccountType> = new Set([
  AccountType.Depository,
  AccountType.Investment,
  AccountType.Other, //need user to confirm which accounts of this type to include
]);
