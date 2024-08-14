import { Box, Text } from "ink";
import React, { useState } from "react";
import { ScreenProps, Screens, Task } from "../../types.js";
import TaskBox from "./TaskBox.js";
import NavigationController from "../util/NavigationController.js";
import { completeTask, createNewTask, deleteTask, subtaskCount, uncompleteTask } from "../../backend/tasks.js";
import SelectInput, { SelectInputProps } from "../util/SelectInput.js";
import TaskDetails from "./TaskDetails.js";
import CreateTaskForm from "./CreateTaskForm.js";

interface TaskTabProps extends ScreenProps {
    title: string
    tasks: Task[]
    setTasks: Function
    setDisableTabNav: Function
}

export default function TaskTab({tasks, setScreenFunc, setTasks, setDisableTabNav}: TaskTabProps) {

    const [rowIndex, setRowIndex] = useState(0);
    const [openedTask, setOpenedTask] = useState<Task>();
    const [creatingTask, setCreatingTask] = useState(false);
    const [showingDialog, setShowingDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState<Object>({});

    const closeDialog = () => {
        setShowingDialog(false);
        setDisableTabNav(false);
    };

    const showDialog = () => {
        setShowingDialog(true);
        setDisableTabNav(true);
    };

    const closeCreateTaskForm = () => {
        setCreatingTask(false);
        setDisableTabNav(false);
    };

    const showCreateTaskForm = () => {
        setCreatingTask(true);
        setDisableTabNav(true);
    };

    const onEnter = () => {
        if (!tasks || tasks.length == 0) {
            console.log("hiii");
            return;
        }
        const selectedTask = tasks[rowIndex];

        if (!selectedTask) {
            console.error("selected task not found!");
            return;
        }
        setOpenedTask(selectedTask);
    };

    const compTaskCallback = () => {
        const taskIndex = selTaskStateIndex();
        if (taskIndex == -1) {
            console.error("failed to get index of selected task in state");
            return;
        }
        const tasksCopy = [...tasks];
        if (!tasksCopy[taskIndex]) {
            console.error("no task at given index of state variable");
            return;
        }
        if (tasksCopy[taskIndex].completed) {
            uncompleteTask(tasksCopy[taskIndex]);
        } else {
            completeTask(tasksCopy[taskIndex]);
        }
        setTasks(tasksCopy);
    };

    const deleteTaskCallback = () => {
        const selectedTask = tasks[rowIndex];
        if (!selectedTask) return;

        const titleDisp = selectedTask.title.length > 15 ? selectedTask.title.substring(0, 15) + "..." : selectedTask.title;

        const selectInputProps: SelectInputProps = {
            prompt: `Delete task? (title: ${titleDisp}, subTasks: ${subtaskCount(selectedTask)})`,
            options: [
                { label: "Yes (delete)", val: true },
                { label: "No (don't delete)", val: false}
            ],
            valueCallback: (v: boolean) => {
                if (v) {
                    console.log("delete task callback...");
                    const tasksCopy = [...tasks];
                    // TODO: why is tasksCopy not modified by deleteTask? I have to return the new tasks list for some reason.
                    const newTasks = deleteTask(selectedTask, tasksCopy);
                    setTasks(newTasks);
                }
            }
        };
        setDialogProps(selectInputProps);
        showDialog();
    };

    /** finds the index of the task in state. returns -1 if it fails to find it. */
    const selTaskStateIndex = (): number => {
        const taskID = tasks[rowIndex]?.id;
        if (!taskID) {
            return -1;
        }
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]?.id == taskID) {
                return i;
            } 
        }
        return -1;
    };

    if (showingDialog) {
        const selectInputProps = dialogProps as SelectInputProps;
        const oldCallback = selectInputProps.valueCallback;
        selectInputProps.valueCallback = (v: any) => {
            if (oldCallback) oldCallback(v);
            closeDialog();
        };
        return (
            <SelectInput 
                {...selectInputProps} />
        );
    }

    if (openedTask) {
        return (
            <TaskDetails {...openedTask} setOpenedTask={setOpenedTask} />
        );
    }

    if (creatingTask) {
        return (
            <CreateTaskForm onCreateTask={(ti) => {
                (async () => {
                    const tasksCopy = [...tasks];
                    createNewTask(tasksCopy, ti.title, ti.priority, ti.dueDate, ti.desc);
                    setTasks(tasksCopy);
                })();
                closeCreateTaskForm();
            }}
            quitForm={closeCreateTaskForm} />
        );
    }

    return (
        <>
            <NavigationController 
                vertIndexSetter={setRowIndex}
                vertIndexMax={Math.max(tasks.length - 1, 0)}
                onEnter={onEnter}
                keyBindings={new Map<string, Function>([
                    ['q', () => {setScreenFunc(Screens.MainMenu)}],
                    ['n', showCreateTaskForm],
                    [' ', compTaskCallback],
                    ['x', deleteTaskCallback]
                ])}
                disabled={showingDialog} />
            <Box marginTop={1}>
                { tasks.length > 0 ? tasks.map((t, i) => {
                    return (
                        <TaskBox {...t} selected={rowIndex == i} key={"taskbox_" + i}/>
                    );
                }) : <Text color={"green"}>No tasks.</Text> }
            </Box>
        </>
    );
}