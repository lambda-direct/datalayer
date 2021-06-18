export function ecranate(data: string) {
    return `\"${data}\"`;
}

export function shouldEcranate(value: any): boolean {
    return typeof value === 'string' || value instanceof Date || value === Object(value);
}