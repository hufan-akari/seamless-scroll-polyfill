export const checkBehavior = (behavior?: string): boolean => {
    return behavior === undefined || behavior === "auto" || behavior === "instant" || behavior === "smooth";
};
