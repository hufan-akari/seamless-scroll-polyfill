import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { failedExecute, invalidBehaviorEnumValue } from "../.internal/error-message.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { isObject } from "../.internal/is-object";
import { windowScrollWithOptions } from "./scrollWithOptions.js";

export const windowScroll = (scrollOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollOptions ?? {};
    const win = config?.window || window;

    if (!isObject(options)) {
        throw new TypeError(failedExecute("scroll", "Window"));
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(invalidBehaviorEnumValue("scroll", "Window", options.behavior!));
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
        const args = arguments;
        if (args.length === 1) {
            windowScroll(args[0], config);
            return;
        }

        originalFunc.apply(this, args as any);
    };
};
