import { Box, Text } from "ink";
import React, { useState } from "react";
import { Task } from "../../types.js";
import SubTask from "./SubTask.js";
import NavigationController from "../util/NavigationController.js";
import Footer from "../util/Footer.js";

interface TaskDetailsProps extends Task {
    closeTask: Function
    parentTask?: Task
    completeTask: (t: Task) => void
}

export default function TaskDetails({title, desc, dueDate, subTasks, completed, closeTask, completeTask}: TaskDetailsProps) {

    const [rowIndex, setRowIndex] = useState(0);

    const getSelectedSubtask = () => {
        if (!subTasks) return undefined;
        return subTasks[rowIndex];
    }

    const completeSubTask = () => {
        const subTask = getSelectedSubtask();
        if (!subTask) return;
        completeTask(subTask);
    }
    
    return (
        <>
            <NavigationController
                vertIndexSetter={setRowIndex}
                vertIndexMax={subTasks ? subTasks.length - 1 : 0}
                keyBindings={new Map<string, Function>([
                    ['q', closeTask],
                    [' ', completeSubTask]
                ])} />
            <Box margin={1} flexDirection="column">
                <Box flexDirection="row" justifyContent="space-between">
                <Text color={ completed ? "green" : "yellow" }>
                    {title}
                    { completed && <Text>{" ✓"}</Text> }

                </Text>
                </Box>
                <Text>{dueDate.toLocaleDateString()}</Text>
                { desc && <Text>{desc}</Text> }
                { subTasks && 
                    <Box marginLeft={1} marginTop={1} flexDirection='column'>
                        <Box marginBottom={1}><Text>Sub-tasks</Text></Box>
                        { subTasks.map((t, i) => {
                            return (
                                <SubTask 
                                    key={"subtask_" + i} 
                                    {...t}
                                    selected={rowIndex == i} />
                            );
                        })}
                    </Box>
                }
                <Footer
                actionDescs={[
                    { keyBind: "Q", shortDesc: "back", color: "gray" },
                    { keyBind: "Space", shortDesc: "complete subtask", color: "greenBright" },
                    { keyBind: "X", shortDesc: "delete subtask", color: "red" },
                ]} />
            </Box>
            
        </>
    );
}