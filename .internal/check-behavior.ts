export const checkBehavior = (behavior?: string): behavior is undefined | ScrollBehavior => {
    return behavior === undefined || behavior === "auto" || behavior === "instant" || behavior === "smooth";
};
