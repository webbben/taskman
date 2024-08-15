import { Box, Text } from "ink";
import React, { useState } from "react";
import { ScreenProps, Screens, Task } from "../../types.js";
import TaskBox from "./TaskBox.js";
import NavigationController from "../util/NavigationController.js";

interface TaskTabProps extends ScreenProps {
    title: string
    /** tasks to be displayed on this tab */
    tabTasks: Task[]
    /** all tasks, including those on other tabs. used during task creation. */
    allTasks: Task[]
    setTasks: Function
    setOpenedTask: Function
    showCreateTaskForm: Function
    delTask: (t: Task) => void
    compTask: (t: Task) => void
}

export default function TaskTab({tabTasks, setScreenFunc, setOpenedTask, showCreateTaskForm, delTask, compTask}: TaskTabProps) {

    const [rowIndex, setRowIndex] = useState(0);

    const getSelectedTask = () => {
        if (!tabTasks || tabTasks.length == 0) {
            return undefined;
        }
        return tabTasks[rowIndex];
    }

    const onEnter = () => {
        const selectedTask = getSelectedTask();
        if (!selectedTask) {
            return;
        }
        setOpenedTask(selectedTask);
    };

    const compTaskCallback = () => {
        const selectedTask = getSelectedTask();
        if (!selectedTask) {
            return;
        }
        compTask(selectedTask);
    };

    const deleteTaskCallback = () => {
        const selectedTask = getSelectedTask();
        if (!selectedTask) return;
        delTask(selectedTask);
    };

    return (
        <>
            <NavigationController 
                vertIndexSetter={setRowIndex}
                vertIndexMax={Math.max(tabTasks.length - 1, 0)}
                onEnter={onEnter}
                keyBindings={new Map<string, Function>([
                    ['q', () => {setScreenFunc(Screens.MainMenu)}],
                    ['n', showCreateTaskForm],
                    [' ', compTaskCallback],
                    ['x', deleteTaskCallback]
                ])} />
            <Box marginTop={1} flexDirection='column'>
                { tabTasks.length > 0 ? tabTasks.map((t, i) => {
                    return (
                        <TaskBox {...t} selected={rowIndex == i} key={"taskbox_" + i}/>
                    );
                }) : <Text color={"green"}>No tasks.</Text> }
            </Box>
        </>
    );
}