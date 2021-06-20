import { IContext, IScrollConfig, now, step } from "../.internal/common.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { nonFinite } from "../.internal/non-finite";

export const windowScrollWithOptions = (
    window: Window & typeof globalThis,
    options: ScrollToOptions,
    config?: IScrollConfig,
): void => {
    const originalBoundFunc = getOriginalMethod(window, "scroll").bind(window);

    const startX = window.scrollX || window.pageXOffset;
    const startY = window.scrollY || window.pageYOffset;

    const targetX = nonFinite(options.left ?? startX);
    const targetY = nonFinite(options.top ?? startY);

    if (targetX === startX && targetY === startY) {
        return;
    }

    if (options.behavior !== "smooth") {
        return originalBoundFunc(targetX, targetY);
    }

    const removeEventListener = () => {
        window.removeEventListener("wheel", cancelScroll);
        window.removeEventListener("touchmove", cancelScroll);
    };

    const context: IContext = {
        timeStamp: now(window),
        duration: config?.duration,
        startX,
        startY,
        targetX,
        targetY,
        rafId: 0,
        method: originalBoundFunc,
        timingFunc: config?.timingFunc,
        callback: removeEventListener,
    };

    const cancelScroll = () => {
        window.cancelAnimationFrame(context.rafId);
        removeEventListener();
    };

    window.addEventListener("wheel", cancelScroll, {
        passive: true,
        once: true,
    });
    window.addEventListener("touchmove", cancelScroll, {
        passive: true,
        once: true,
    });

    step(context, config);
};
