import { Key, useInput } from "ink";
import React from "react";
import { exit } from "../../backend/system.js";

interface NavControllerProps {
    keyBindings?: Map<string | Key, Function>
    vertIndexSetter?: React.Dispatch<React.SetStateAction<number>>
    vertIndexMax?: number
    horizIndexSetter?: React.Dispatch<React.SetStateAction<number>>
    horizIndexMax?: number
    wasd?: boolean
    onEnter?: Function
    disabled?: boolean
}

export default function NavigationController({keyBindings, vertIndexSetter, vertIndexMax, horizIndexSetter, horizIndexMax, wasd, onEnter, disabled}: NavControllerProps) {
    if ((vertIndexSetter && !vertIndexMax) || (horizIndexSetter && !horizIndexMax)) {
        //console.error("navController: indexSetter defined without corresponding index max");
    }
    
    const up = () => {
        if (!vertIndexSetter) return;

        vertIndexSetter((i) => {
            if (i <= 0) {
                return vertIndexMax ||  0;
            }
            return i - 1;
        });
    }
    const down = () => {
        if (!vertIndexSetter) return;

        vertIndexSetter((i) => {
            if (i >= (vertIndexMax || 0)) {
                return 0;
            }
            return i + 1;
        });
    }
    const left = () => {
        if (!horizIndexSetter) return;

        horizIndexSetter((i) => {
            if (i <= 0) {
                return horizIndexMax || 0;
            }
            return i - 1;
        });
    }
    const right = () => {
        if (!horizIndexSetter) return;

        horizIndexSetter((i) => {
            if (i >= (horizIndexMax || 0)) {
                return 0;
            }
            return i + 1;
        });
    }

    useInput((input, key) => {
        if (disabled) return;

        // global escape
        if (key.escape) exit();

        if (keyBindings?.has(input)) {
            (keyBindings.get(input) || (() => {console.log(input + ": no function binding found")}))()
            return
        }
        if (keyBindings?.has(key)) {
            (keyBindings.get(key) || (() => {console.log(key + ": no function binding found")}))()
            return
        }
        if (key?.return && onEnter) {
            onEnter();
            return;
        }
        if (wasd) {
            if (input == "w") {
                up();
            } else if (input == "a") {
                left();
            } else if (input == "s") {
                down();
            } else if (input == "d") {
                right();
            }
        } else {
            if (!key) return;
            if (key.upArrow) {
                up();
            } else if (key.leftArrow) {
                left();
            } else if (key.downArrow) {
                down();
            } else if (key.rightArrow) {
                right();
            }
        }
    });

    return null;
}