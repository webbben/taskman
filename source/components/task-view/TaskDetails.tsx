import { Box, Text } from "ink";
import React from "react";
import { Task, TaskTypeToString } from "../../types.js";
import SubTask from "./SubTask.js";

interface TaskDetailsProps extends Task {
    setOpenedTask: React.Dispatch<React.SetStateAction<Task | undefined>>
    parentTask?: Task
}

export default function TaskDetails({title, desc, dueDate, subTasks, type, completed}: TaskDetailsProps) {

    return (
        <>
            <Box margin={1} flexDirection="column">
                <Box flexDirection="row" justifyContent="space-between">
                <Text color={ completed ? "green" : "yellow" }>
                    {title}
                    { completed && <Text>{" ✓"}</Text> }

                </Text>
                <Text>{TaskTypeToString(type)}</Text>
                </Box>
                <Text>{dueDate.toLocaleDateString()}</Text>
                { desc && <Text>{desc}</Text> }
                { subTasks && subTasks.map((t) => {
                    return (
                        <SubTask {...t} />
                    );
                })}
            </Box>
        </>
    );
}