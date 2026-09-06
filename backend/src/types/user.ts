export interface UserPublic {
  id: string;
  email: string;
  name: string | null;
  provider: string;
  avatarUrl: string | null;
  liquidSalary: number | null;
  currency: string;
  locale: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  password?: string;
  provider?: 'local' | 'google' | 'apple';
  providerId?: string;
  avatarUrl?: string;
  liquidSalary?: number;
}
