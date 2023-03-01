export function getLongestLen<T extends { length: number }>(arr: T[]): number;
export function getLongestLen<T>(arr: T[], getTarget: (it: T) => { length: number }): number;
export function getLongestLen<T extends { length: number }>(
  arr: T[],
  getTarget?: (it: T) => { length: number }
): number {
  return arr.reduce((result, it) => {
    const target = getTarget ? getTarget(it) : it;
    if (!target.length) {
      throw new Error('target does not have a "length" property!');
    }
    return target.length > result ? target.length : result;
  }, 0);
}

export function fillSpace2Len(target: string, len: number): string {
  const space = ' '.repeat(Math.abs(len - target.length));
  return target + space;
}
