const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Partial<Pick<T, K>> => {
  const finalObj: Partial<Pick<T, K>> = {};

  keys.forEach((key) => {
    if (obj && Object.hasOwn(obj, key)) {
      finalObj[key] = obj[key];
    }
  });

  return finalObj;
};

export default pick;
