import { IAnimationOptions, IScrollToOptions } from "./common.js";
import { originalWindowScroll, windowScroll } from "./Window.scroll.js";

export const windowScrollBy = (options: IScrollToOptions) => {
    const left = (options.left || 0) + (window.scrollX || window.pageXOffset);
    const top = (options.top || 0) + (window.scrollY || window.pageYOffset);

    if (options.behavior !== "smooth") {
        return originalWindowScroll(left, top);
    }

    return windowScroll({ ...options, left, top });
};

export const polyfill = (options: IAnimationOptions) => {
    const originalFunc = window.scrollBy;
    window.scrollBy = function scrollBy() {
        const [arg0 = 0, arg1 = 0] = arguments;

        if (typeof arg0 === "number" && typeof arg1 === "number") {
            return originalFunc(arg0, arg1);
        }

        if (Object(arg0) !== arg0) {
            throw new TypeError("Failed to execute 'scrollBy' on 'Window': parameter 1 ('options') is not an object.");
        }

        return windowScrollBy({ ...arg0, ...options });
    };
};
