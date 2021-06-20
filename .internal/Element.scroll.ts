export function elementScrollXY(this: Element, x: number, y: number): void {
    this.scrollLeft = x;
    this.scrollTop = y;
}
