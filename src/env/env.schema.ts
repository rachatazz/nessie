import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEMN_EXPIRES_IN: z.string().default('7d'),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  AUTHEN_TYPE: z.enum(['STATEFUL', 'STATELESS']).default('STATELESS'),
});

export type Env = z.infer<typeof EnvSchema>;
