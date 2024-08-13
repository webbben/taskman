import { Box, Text } from "ink";
import React from "react";
import { Task } from "../../types.js";

interface SubTaskProps extends Task {

}

export default function SubTask({title, completed}: SubTaskProps) {
    return (
        <Box>
            <Text color={completed ? "green" : "yellow" }>
                <Text>{ completed ? "●" : "○" }{ ` ${title}` }</Text>
            </Text>
        </Box>
    )
}