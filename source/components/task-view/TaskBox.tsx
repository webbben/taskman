import { Box, Text } from "ink";
import { Task } from "../../types.js";
import React, { useEffect, useState } from "react";

interface TaskBoxProps extends Task {
    selected?: boolean
}

export default function TaskBox({desc, title, completed, dueDate, selected, subTasks}:TaskBoxProps) {

    const [blink, setBlink] = useState(true);

    const overdue = dueDate.getDate() < new Date().getDate();

    if (desc) {
        if (desc.length > 100) {
            desc = desc.substring(0, 100) + "...";
        }
    }

    useEffect(() => {
        if (selected) {
            const timer = setInterval(() => {
                setBlink((b) => !b);
            }, 2000);

            return () => {
                clearInterval(timer);
            }
        }
        return;
    }, [selected]);

    return (
        <Box
            flexDirection="column"
            borderStyle={selected ? (blink ? "round" : "bold") : undefined}
            padding={selected ? 0 : 1}
            width={"100%"}>
            <Box flexDirection="row" justifyContent="space-between">
                <Text color={ completed ? "green" : "yellow" }>{title}{ completed && <Text>{" ✓"}</Text> }</Text>
                <Text color={ overdue ? "red" : "cyan" }>{dueDate.toLocaleDateString()}</Text>
            </Box>
            { desc && <Text>{desc}</Text> }
            { subTasks && 
                <Box flexDirection="row" justifyContent="space-between">
                    <Text>
                    { subTasks?.map((st, i) => {
                        return (
                            <Text key={"subtaskcircle_" + i} color={"greenBright"}>{st.completed ? " ● " : " ○ "}</Text>
                        );
                    })}
                    </Text>
                    <Text color="greenBright">{`(${subTasks.filter((t) => t.completed).length}/${subTasks.length})`}</Text>
                </Box>
            }
        </Box>
    );
}