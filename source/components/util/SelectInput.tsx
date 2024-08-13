import { Box, render, Text } from "ink";
import React, { useState } from "react";
import NavigationController from "./NavigationController.js";

interface InputOption {
    label: string
    callback?: Function
    val: any
}

export interface SelectInputProps {
    prompt?: string
    options: InputOption[]
    valueCallback?: (v: any) => any | void
}

export default function SelectInput({prompt, options, valueCallback}: SelectInputProps) {

    const [selIndex, setSelIndex] = useState(0);

    if (options.length == 0) {
        console.error("no options provided to SelectInput");
        return;
    }

    const onSubmit = () => {
        if (options[selIndex] && valueCallback) {
            valueCallback(options[selIndex].val);
        }
        if (options[selIndex]?.callback) {
            options[selIndex].callback();
        }
    }

    return (
        <>
            <NavigationController 
                vertIndexSetter={setSelIndex} 
                vertIndexMax={options.length - 1}
                onEnter={onSubmit} />
            <Box borderStyle={"doubleSingle"} flexDirection="column">
                { prompt && <Box marginBottom={1}><Text>{prompt}</Text></Box> }
                {
                    options.map((op, i) => {
                        const sel = selIndex == i;
                        const color = sel ? "cyanBright" : "white";
                        return (
                            <Box flexDirection="row" key={"selectInputOp" + i}>
                                { sel && <Text color={color}>{"> "}</Text>}
                                <Text color={color}>{op.label}</Text>
                            </Box>
                        );
                    })
                }
            </Box>
        </>
    );
}

export async function openSelectInput(props: SelectInputProps): Promise<any> {
    return new Promise(res => {
        const { clear, unmount } = render(
          <SelectInput
            {...props}
            valueCallback={value => {
              clear();
              unmount();
              res(value);
            }}
          />
        );
    });
}