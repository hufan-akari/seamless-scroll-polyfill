import { checkBehavior } from "../.internal/check-behavior.js";
import type { IScrollConfig } from "../.internal/common.js";
import { isScrollBehaviorSupported } from "../.internal/common.js";
import { failedExecute, invalidBehaviorEnumValue } from "../.internal/error-message.js";
import { isObject } from "../.internal/is-object.js";
import { modifyPrototypes } from "../.internal/modify-prototypes";
import { nonFinite } from "../.internal/non-finite";
import { elementScrollWithOptions } from "./scrollWithOptions.js";

export const elementScrollBy = (element: Element, scrollByOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollByOptions ?? {};
    if (!isObject(options)) {
        throw new TypeError(failedExecute("scrollBy", "Element"));
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(invalidBehaviorEnumValue("scrollBy", "Element", options.behavior));
    }

    const left = nonFinite(options.left) + element.scrollLeft;
    const top = nonFinite(options.top) + element.scrollTop;

    elementScrollWithOptions(element, { ...options, left, top }, config);
};

export const elementScrollByPolyfill = (config?: IScrollConfig): void => {
    if (isScrollBehaviorSupported(config?.window || window)) {
        return;
    }

    modifyPrototypes((prototype) => {
        prototype.scrollBy = function scrollBy() {
            const args = arguments;
            if (args.length === 1) {
                elementScrollBy(this, args[0], config);
                return;
            }

            elementScrollBy(this, { left: args[0], top: args[1] }, config);
        };
    });
};
