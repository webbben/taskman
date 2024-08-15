import { unmountApp } from "../appFuncs.js";

// TODO - save data before exiting?
export function exit() {
    unmountApp();
    console.clear();
    console.log("see ya!");
    process.exit();
}