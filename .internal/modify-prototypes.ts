type Prototype = typeof HTMLElement.prototype | typeof SVGElement.prototype | typeof Element.prototype;

const prototypes = [HTMLElement.prototype, SVGElement.prototype, Element.prototype];

export const modifyPrototypes = (modification: (prototype: Prototype) => void): void => {
    prototypes.forEach((prototype) => {
        modification(prototype);
    });
};
