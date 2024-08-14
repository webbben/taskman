import { Box, Text } from "ink";
import { Task } from "../../types.js";
import React from "react";

interface TaskBoxProps extends Task {
    selected?: boolean
}

export default function TaskBox({desc, title, completed, dueDate, selected}:TaskBoxProps) {
    const overdue = dueDate.getDate() < new Date().getDate();

    if (desc) {
        if (desc.length > 100) {
            desc = desc.substring(0, 100) + "...";
        }
    }

    return (
        <Box
            flexDirection="column"
            borderStyle={selected ? "round" : undefined}
            padding={selected ? 0 : 1}
            width={"100%"}>
            <Box flexDirection="row" justifyContent="space-between">
                <Text color={ completed ? "green" : "yellow" }>{title}{ completed && <Text>{" ✓"}</Text> }</Text>
                <Text color={ overdue ? "red" : "cyan" }>{dueDate.toLocaleDateString()}</Text>
            </Box>
            { desc && <Text>{desc}</Text> }
        </Box>
    );
}