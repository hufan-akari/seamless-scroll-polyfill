import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { failedExecute, invalidBehaviorEnumValue } from "../.internal/error-message.js";
import { isObject } from "../.internal/is-object";
import { nonFinite } from "../.internal/non-finite";
import { windowScroll } from "./scroll.js";

export const windowScrollBy = (scrollByOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollByOptions ?? {};

    if (!isObject(options)) {
        throw new TypeError(failedExecute("scrollBy", "Window"));
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(invalidBehaviorEnumValue("scrollBy", "Window", options.behavior!));
    }

    const left = nonFinite(options.left) + (window.scrollX || window.pageXOffset);
    const top = nonFinite(options.top) + (window.scrollY || window.pageYOffset);

    windowScroll({ ...options, left, top }, config);
};

export const windowScrollByPolyfill = (config?: IScrollConfig): void => {
    const win = config?.window || window;

    if (isScrollBehaviorSupported(win)) {
        return;
    }

    win.scrollBy = function scrollBy() {
        const args = arguments;
        if (args.length === 1) {
            windowScrollBy(args[0], config);
            return;
        }

        windowScrollBy({ left: args[0], top: args[1] }, config);
    };
};
