export const isObject = (value: unknown): boolean => {
    const type = typeof value;
    return value !== null && (type === "object" || type === "function");
};
