import { duration, unitOfTime } from 'moment';

export function ms(variousTime: string): number {
  const matches = variousTime.match(/^(\d+)([a-zA-Z]+)$/);
  if (!matches) return 0;

  const inp = matches[1];
  const unit = matches[2] as unitOfTime.DurationConstructor;
  return duration(inp, unit).asMilliseconds();
}

export function jsonParse<T = unknown>(str: T): object | T {
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (e) {
    return str;
  }
}
