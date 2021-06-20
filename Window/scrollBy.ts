import { checkBehavior } from "../.internal/check-behavior.js";
import { IScrollConfig, isScrollBehaviorSupported } from "../.internal/common.js";
import { nonFinite } from "../.internal/non-finite";
import { isObject } from "../.internal/is-object";
import { windowScroll } from "./scroll.js";

export const windowScrollBy = (scrollByOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollByOptions ?? {};

    if (!isObject(options)) {
        throw new TypeError("Failed to execute 'scrollBy' on 'Window': cannot convert to dictionary.");
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(
            `Failed to execute 'scrollBy' on 'Window': The provided value '${options.behavior}' is not a valid enum value of type ScrollBehavior.`,
        );
    }

    const left = nonFinite(options.left) + (window.scrollX || window.pageXOffset);
    const top = nonFinite(options.top) + (window.scrollY || window.pageYOffset);

    return windowScroll({ ...options, left, top }, config);
};

export const windowScrollByPolyfill = (config?: IScrollConfig): void => {
    const win = config?.window || window;

    if (isScrollBehaviorSupported(win)) {
        return;
    }

    win.scrollBy = function scrollBy() {
        if (arguments.length === 1) {
            windowScrollBy(arguments[0], config);
            return;
        }

        windowScrollBy({ left: arguments[0], top: arguments[1] }, config);
    };
};
