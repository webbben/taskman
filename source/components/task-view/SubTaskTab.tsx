import { Box, Text } from "ink";
import React, { useState } from "react";
import { Task } from "../../types.js";
import SubTask from "./SubTask.js";
import NavigationController from "../util/NavigationController.js";
import Footer from "../util/Footer.js";

interface SubTaskTabProps {
    subTasks?: Task[]
    completeTask: (t: Task) => void
    closeTask: () => void
    deleteTask: (t: Task) => void
    editTask: (t: Task) => void
}

export default function SubTaskTab({subTasks, completeTask, closeTask, deleteTask, editTask}: SubTaskTabProps) {
    const [rowIndex, setRowIndex] = useState(0);

    const getSelectedSubtask = () => {
        if (!subTasks) return undefined;
        return subTasks[rowIndex];
    };

    const completeSubTask = () => {
        const subTask = getSelectedSubtask();
        if (!subTask) return;
        completeTask(subTask);
    };

    const deleteSubTask = () => {
        const subTask = getSelectedSubtask();
        if (!subTask) return;
        deleteTask(subTask);
    }

    const editSubTask = () => {
        const subTask = getSelectedSubtask();
        if (!subTask) return;
        editTask(subTask);
    }

    return (
        <>
            <NavigationController
                vertIndexSetter={setRowIndex}
                vertIndexMax={subTasks ? subTasks.length - 1 : 0}
                keyBindings={new Map<string, Function>([
                    [' ', completeSubTask],
                    ['q', closeTask],
                    ['x', deleteSubTask],
                    ['e', editSubTask]
                ])} />
            <Box flexDirection='column'>
                <Box marginBottom={1}><Text>Sub-tasks</Text></Box>
                
                { subTasks ? subTasks.map((t, i) => {
                    return (
                        <SubTask 
                            key={"subtask_" + i} 
                            {...t}
                            selected={rowIndex == i} />
                    );
                }) : <Text>No sub-tasks.</Text>}
                
            </Box>
            <Footer
                actionDescs={[
                    { keyBind: "Q", shortDesc: "back", color: "gray" },
                    { keyBind: "Space", shortDesc: "complete subtask", color: "greenBright" },
                    { keyBind: "E", shortDesc: "edit subtask", color: "cyanBright" },
                    { keyBind: "X", shortDesc: "delete subtask", color: "red" },
                ]} />
        </>
    );
}