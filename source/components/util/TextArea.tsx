import TextInput, { Props as TextInputProps } from "ink-text-input";
import ScrollArea, { BorderProps } from "./ScrollArea.js";
import React from "react";
import { Text } from "ink";

interface TextAreaProps extends TextInputProps {
    height: number
    borderProps?: BorderProps
    editMode?: boolean
}

export default function TextArea({height, borderProps, editMode = true, ...textInputProps}: TextAreaProps) {

    return (
        <ScrollArea height={height} {...borderProps}>
            { editMode ? <TextInput {...textInputProps} /> : <Text>{textInputProps.value}</Text> }
        </ScrollArea>
    );
}