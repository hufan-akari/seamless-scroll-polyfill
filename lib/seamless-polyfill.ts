import { IScrollConfig, isScrollBehaviorSupported } from "../.internal/common.js";
import {
    elementScrollByPolyfill,
    elementScrollIntoViewPolyfill,
    elementScrollPolyfill,
    elementScrollToPolyfill,
} from "../Element/index.js";
import { windowScrollByPolyfill, windowScrollPolyfill, windowScrollToPolyfill } from "../Window/index.js";

export const polyfill = (config?: IScrollConfig): void => {
    if (isScrollBehaviorSupported(config?.window || window)) {
        return;
    }

    elementScrollPolyfill(config);
    elementScrollToPolyfill(config);
    elementScrollByPolyfill(config);
    elementScrollIntoViewPolyfill(config);

    windowScrollPolyfill(config);
    windowScrollToPolyfill(config);
    windowScrollByPolyfill(config);
};
