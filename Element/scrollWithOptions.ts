import type { IContext, IScrollConfig } from "../.internal/common.js";
import { now, step } from "../.internal/common.js";
import { getOriginalMethod } from "../.internal/get-original-method.js";
import { nonFinite } from "../.internal/non-finite";

export const elementScrollWithOptions = (
    element: Element,
    options: Readonly<ScrollToOptions>,
    config?: IScrollConfig,
): void => {
    if (!element.isConnected) {
        return;
    }

    const win = config?.window || window;
    const originalBoundFunc = getOriginalMethod(win.HTMLElement.prototype, "scroll").bind(element);

    const startX = element.scrollLeft;
    const startY = element.scrollTop;

    const targetX = nonFinite(options.left ?? startX);
    const targetY = nonFinite(options.top ?? startY);

    if (targetX === startX && targetY === startY) {
        return;
    }

    if (options.behavior !== "smooth") {
        originalBoundFunc(targetX, targetY);
        return;
    }

    const removeEventListener = () => {
        win.removeEventListener("wheel", cancelScroll);
        win.removeEventListener("touchmove", cancelScroll);
    };

    const context: IContext = {
        timeStamp: now(win),
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
        win.cancelAnimationFrame(context.rafId);
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
