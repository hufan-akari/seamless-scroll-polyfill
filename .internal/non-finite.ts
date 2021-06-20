// https://drafts.csswg.org/cssom-view/#normalize-non-finite-values

export const nonFinite = (value: unknown): number => {
    if (!isFinite(value as number)) {
        return 0;
    }
    return Number(value);
};
