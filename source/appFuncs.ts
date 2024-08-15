let unmountFunction: Function | undefined;

export function setUnmountFunction(unmount: Function) {
    unmountFunction = unmount;
}

/** unmounts the ink app */
export function unmountApp() {
    if (unmountFunction) unmountFunction();
}