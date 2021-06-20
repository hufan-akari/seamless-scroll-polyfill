import { checkBehavior } from "../.internal/check-behavior.js";
import { IScrollConfig, isScrollBehaviorSupported } from "../.internal/common.js";
import { isObject } from "../.internal/is-object.js";
import { modifyPrototypes } from "../.internal/modify-prototypes";
import { nonFinite } from "../.internal/non-finite";
import { elementScrollWithOptions } from "./scrollWithOptions.js";

export const elementScrollBy = (element: Element, scrollByOptions?: ScrollToOptions, config?: IScrollConfig): void => {
    const options = scrollByOptions ?? {};
    if (!isObject(options)) {
        throw new TypeError("Failed to execute 'scrollBy' on 'Element': cannot convert to dictionary.");
    }

    if (!checkBehavior(options.behavior)) {
        throw new TypeError(
            `Failed to execute 'scrollBy' on 'Element': The provided value '${options.behavior}' is not a valid enum value of type ScrollBehavior.`,
        );
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
            if (arguments.length === 1) {
                elementScrollBy(this, arguments[0], config);
                return;
            }

            elementScrollBy(this, { left: arguments[0], top: arguments[1] }, config);
        };
    });
};
