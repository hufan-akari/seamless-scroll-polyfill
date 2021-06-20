export const isScrollBehaviorSupported = (window: Window & typeof globalThis): boolean =>
    "scrollBehavior" in window.document.documentElement.style;

export interface IScrollConfig {
    duration?: number;
    timingFunc?: (k: number) => number;
    window?: Window & typeof globalThis;
}

export interface IContext extends IScrollConfig {
    timeStamp: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    rafId: number;
    method: (x: number, y: number) => void;
    callback: () => void;
}

const ease = (k: number) => {
    return 0.5 * (1 - Math.cos(Math.PI * k));
};

export const now = (window: Window & typeof globalThis): number => window.performance?.now?.() ?? Date.now();

const DURATION = 500;

export const step = (context: IContext, config?: IScrollConfig): void => {
    const win = config?.window || window;
    const currentTime = now(win);

    const elapsed = (currentTime - context.timeStamp) / (context.duration || DURATION);
    if (elapsed > 1) {
        context.method(context.targetX, context.targetY);
        context.callback();
        return;
    }
    const value = (context.timingFunc || ease)(elapsed);

    const currentX = context.startX + (context.targetX - context.startX) * value;
    const currentY = context.startY + (context.targetY - context.startY) * value;

    context.method(currentX, currentY);

    context.rafId = win.requestAnimationFrame(() => {
        step(context, config);
    });
};
