export function isFunction(value) {
    return typeof value === 'function';
}
export function runIfFn(valueOrFn, ...arg) {
    return isFunction(valueOrFn) ? valueOrFn(...arg) : valueOrFn;
}