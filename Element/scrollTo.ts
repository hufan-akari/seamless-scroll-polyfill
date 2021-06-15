import { IAnimationOptions, isObject, isScrollBehaviorSupported, modifyPrototypes, original } from "../.internal/common.js";
import { elementScroll } from "./scroll.js";

export { elementScroll as elementScrollTo } from "./scroll.js";

export const elementScrollToPolyfill = (animationOptions?: IAnimationOptions): void => {
    if (isScrollBehaviorSupported()) {
        return;
    }

    const originalFunc = original.elementScroll;

    modifyPrototypes(
        (prototype) =>
            (prototype.scrollTo = function scrollTo() {
                if (arguments.length === 1) {
                    const scrollToOptions = arguments[0];
                    if (!isObject(scrollToOptions)) {
                        throw new TypeError(
                            "Failed to execute 'scrollTo' on 'Element': parameter 1 ('options') is not an object.",
                        );
                    }

                    const left = Number(scrollToOptions.left);
                    const top = Number(scrollToOptions.top);

                    return elementScroll(this, { ...scrollToOptions, left, top, ...animationOptions });
                }

                return originalFunc.apply(this, arguments as any);
            }),
    );
};
