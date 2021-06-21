import { elementScrollXY } from "../.internal/Element.scroll";
import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { failedExecute, invalidBehaviorEnumValue } from "../.internal/error-message";
import { getOriginalMethod } from "../.internal/get-original-method";
import { isObject } from "../.internal/is-object.js";
import { modifyPrototypes } from "../.internal/modify-prototypes";
import { elementScrollWithOptions } from "./scrollWithOptions.js";

export const elementScroll = (element: Element, scrollOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollOptions ?? {};
    if (!isObject(options)) {
        throw new TypeError(failedExecute("scroll", "Element"));
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(invalidBehaviorEnumValue("scroll", "Element", options.behavior!));
    }

    elementScrollWithOptions(element, options, config);
};

export const elementScrollPolyfill = (config?: IScrollConfig): void => {
    const win = config?.window || window;

    if (isScrollBehaviorSupported(win)) {
        return;
    }

    const originalFunc = getOriginalMethod(win.HTMLElement.prototype, "scroll") || elementScrollXY;

    modifyPrototypes((prototype) => {
        prototype.scroll = function scroll() {
            const args = arguments;
            if (args.length === 1) {
                elementScroll(this, args[0], config);
                return;
            }

            originalFunc.apply(this, args as any);
        };
    });
};
