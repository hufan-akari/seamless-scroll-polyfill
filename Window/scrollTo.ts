import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { failedExecute, invalidBehaviorEnumValue } from "../.internal/error-message.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { isObject } from "../.internal/is-object";
import { windowScrollWithOptions } from "./scrollWithOptions.js";

export const windowScrollTo = (scrollToOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollToOptions ?? {};
    const win = config?.window || window;

    if (!isObject(options)) {
        throw new TypeError(failedExecute("scrollTo", "Window"));
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(invalidBehaviorEnumValue("scrollTo", "Window", options.behavior!));
    }

    windowScrollWithOptions(win, options, config);
};

export const windowScrollToPolyfill = (config?: IScrollConfig): void => {
    const win = config?.window || window;

    if (isScrollBehaviorSupported(win)) {
        return;
    }

    const originalFunc = getOriginalMethod(win, "scrollTo") || getOriginalMethod(win, "scroll");

    win.scrollTo = function scrollTo() {
        const args = arguments;
        if (args.length === 1) {
            windowScrollTo(args[0], config);
            return;
        }

        originalFunc.apply(this, args as any);
    };
};
