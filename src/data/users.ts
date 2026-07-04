export interface TestUser {
  username: string;
  password: string;
}

export const users = {
  standardUser: { username: 'standard_user', password: 'secret_sauce' }
} satisfies Record<string, TestUser>;

export type TestUserKey = keyof typeof users;

export function getUser(key: TestUserKey): TestUser {
  return users[key];
}
