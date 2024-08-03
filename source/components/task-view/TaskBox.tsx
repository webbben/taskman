import { Box, Text } from "ink";
import { Task } from "../../types.js";
import React from "react";

export default function TaskBox({desc, title, completed, dueDate}:Task) {
    const overdue = dueDate.getDate() < new Date().getDate()
    return (
        <Box margin={1} flexDirection="column">
            <Text color={ completed ? "green" : "yellow" }>{title}{ completed && <Text>{" ✓"}</Text> }</Text>
            { desc && <Text>{desc}</Text> }
            <Text color={ overdue ? "red" : "cyan" }>{dueDate.toLocaleDateString()}</Text>
        </Box>
    );
}