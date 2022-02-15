export const ecranate = (data: string) => `"${data}"`;

export const shouldEcranate = (value: any): boolean => typeof value === 'string' || value === Object(value);
