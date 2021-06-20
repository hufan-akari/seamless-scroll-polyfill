import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { isObject } from "../.internal/is-object";
import { windowScrollWithOptions } from "./scrollWithOptions.js";

export const windowScroll = (scrollOptions: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollOptions ?? {};
    const win = config?.window || window;

    if (!isObject(options)) {
        throw new TypeError("Failed to execute 'scroll' on 'Window': cannot convert to dictionary.");
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(
            `Failed to execute 'scroll' on 'Window': The provided value '${options.behavior!}' is not a valid enum value of type ScrollBehavior.`,
        );
    }

    windowScrollWithOptions(win, options, config);
};

export const windowScrollPolyfill = (config?: IScrollConfig): void => {
    const win = config?.window || window;

    if (isScrollBehaviorSupported(win)) {
        return;
    }

    const originalFunc = getOriginalMethod(win, "scroll");

    win.scroll = function scroll() {
        if (arguments.length === 1) {
            windowScroll(arguments[0], config);
            return;
        }

        originalFunc.apply(this, arguments as any);
    };
};
