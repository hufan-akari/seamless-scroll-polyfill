interface GetOriginalMethod {
    <K extends keyof Element>(proto: typeof Element.prototype, method: K): Element[K];
    <K extends keyof Window>(proto: typeof window, method: K): Window[K];
}

export const getOriginalMethod: GetOriginalMethod = (proto: any, method: string) => {
    const __$$method$$__ = `__$$${method}$$__`;
    proto[__$$method$$__] ||= proto[method];

    return proto[__$$method$$__];
};
