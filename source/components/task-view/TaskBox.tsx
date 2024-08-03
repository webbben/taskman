import { Box, Text } from "ink";
import { Task } from "../../types.js";
import React from "react";

interface TaskBoxProps extends Task {
    selected: boolean
}

export default function TaskBox({desc, title, completed, dueDate, selected}:TaskBoxProps) {
    const overdue = dueDate.getDate() < new Date().getDate()
    return (
        <Box 
            marginLeft={1}
            marginRight={1} 
            flexDirection="column"
            borderStyle={selected ? "round" : undefined}
            padding={selected ? 0 : 1}>
            <Text color={ completed ? "green" : "yellow" }>{title}{ completed && <Text>{" ✓"}</Text> }</Text>
            { desc && <Text>{desc}</Text> }
            <Text color={ overdue ? "red" : "cyan" }>{dueDate.toLocaleDateString()}</Text>
        </Box>
    );
}