import { checkBehavior } from "../.internal/check-behavior.js";
import { IScrollConfig, isScrollBehaviorSupported } from "../.internal/common.js";
import { modifyPrototypes } from "../.internal/modify-prototypes";
import { elementScrollXY } from "../.internal/Element.scroll.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { isObject } from "../.internal/is-object.js";
import { elementScrollWithOptions } from "./scrollWithOptions.js";

export const elementScrollTo = (element: Element, scrollToOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollToOptions ?? {};
    if (!isObject(options)) {
        throw new TypeError("Failed to execute 'scrollTo' on 'Element': cannot convert to dictionary.");
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(
            `Failed to execute 'scrollTo' on 'Element': The provided value '${options.behavior}' is not a valid enum value of type ScrollBehavior.`,
        );
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
            if (arguments.length === 1) {
                elementScrollTo(this, arguments[0], config);
                return;
            }

            originalFunc.apply(this, arguments as any);
        };
    });
};
