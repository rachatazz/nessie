import { ZodError, ZodIssue } from 'zod';
import { Env, EnvSchema } from './env.schema';
import { Logger } from '@nestjs/common';

function formatZodEnvIssue(issue: ZodIssue): string {
  const { path, message } = issue;
  const pathString = path.join('.');
  return `${pathString}: ${message}`;
}

function formatZodEnvError(error: ZodError): string[] {
  const { issues } = error;
  return issues.map(formatZodEnvIssue);
}

function logError(error: string): void {
  Logger.error(error, 'EnvValidator');
}

export function envValidate(env: Record<string, string>): Env {
  try {
    return EnvSchema.parse(env);
  } catch (error) {
    const zodErrors = formatZodEnvError(error as ZodError);
    zodErrors.forEach(logError);
    const messages = zodErrors.join('\n');
    throw messages;
  }
}
