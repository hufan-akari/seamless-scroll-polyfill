import {
    elementScrollByPolyfill,
    elementScrollIntoViewPolyfill,
    elementScrollPolyfill,
    elementScrollToPolyfill,
} from "../Element/index.js";
import { IAnimationOptions, isScrollBehaviorSupported } from "../.internal/common.js";
import { windowScrollByPolyfill, windowScrollPolyfill, windowScrollToPolyfill } from "../Window/index.js";

export const polyfill = (options?: IAnimationOptions): void => {
    if (isScrollBehaviorSupported()) {
        return;
    }

    elementScrollPolyfill(options);
    elementScrollToPolyfill(options);
    elementScrollByPolyfill(options);
    elementScrollIntoViewPolyfill(options);

    windowScrollPolyfill(options);
    windowScrollToPolyfill(options);
    windowScrollByPolyfill(options);
};
