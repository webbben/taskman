import { Box, Text } from "ink";
import React from "react";
import { Task } from "../../types.js";

interface SubTaskProps extends Task {
    selected?: boolean
}

export default function SubTask({title, completed, selected}: SubTaskProps) {
    const color = selected ? "cyanBright" : completed ? "green" : "yellow";
    return (
            <Box>
                <Text color={color}>
                    <Text>{selected ? "> " : "  "}{completed ? "✓" : "○"}{ ` ${title}` }</Text>
                </Text>
            </Box>
    );
}