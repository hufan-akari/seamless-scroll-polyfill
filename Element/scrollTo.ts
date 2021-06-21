import { elementScrollXY } from "../.internal/Element.scroll.js";
import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { failedExecute, invalidBehaviorEnumValue } from "../.internal/error-message.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { isObject } from "../.internal/is-object.js";
import { modifyPrototypes } from "../.internal/modify-prototypes";
import { elementScrollWithOptions } from "./scrollWithOptions.js";

export const elementScrollTo = (element: Element, scrollToOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollToOptions ?? {};
    if (!isObject(options)) {
        throw new TypeError(failedExecute("scrollTo", "Element"));
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(invalidBehaviorEnumValue("scrollTo", "Element", options.behavior!));
    }

    elementScrollWithOptions(element, options, config);
};

export const elementScrollToPolyfill = (config?: IScrollConfig): void => {
    const win = config?.window || window;

    if (isScrollBehaviorSupported(win)) {
        return;
    }

    const originalFunc =
        getOriginalMethod(win.HTMLElement.prototype, "scrollTo") ||
        getOriginalMethod(win.HTMLElement.prototype, "scroll") ||
        elementScrollXY;

    modifyPrototypes((prototype) => {
        prototype.scrollTo = function scrollTo() {
            const args = arguments;
            if (args.length === 1) {
                elementScrollTo(this, args[0], config);
                return;
            }

            originalFunc.apply(this, args as any);
        };
    });
};
