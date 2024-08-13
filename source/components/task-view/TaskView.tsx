import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { Priority, ScreenProps, Screens, Task } from "../../types.js";
import { completeTask, createNewTask, deleteTask, loadTasks, subtaskCount } from "../../backend/tasks.js";
import TaskBox from "./TaskBox.js";
import NavigationController from "../util/NavigationController.js";
import TaskDetails from "./TaskDetails.js";
import CreateTaskForm from "./CreateTaskForm.js";
import SelectInput, { SelectInputProps } from "../util/SelectInput.js";

export default function TaskView({setScreenFunc}:ScreenProps) {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [colIndex, setColIndex] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    const [openedTask, setOpenedTask] = useState<Task>();
    const [creatingTask, setCreatingTask] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState<Object>({});
    /** tracks if there are unsaved changes or not */
    //const unsavedChanges = useRef<boolean>(false);

    useEffect(() => {
        (async () => {
            setTasks(loadTasks())
        })()
    }, []);

    useEffect(() => {
        setIndices();
    }, [tasks]);

    const sortFunc = (a: Task, _b: Task) => {
        if (a.completed) {
            return 1;
        }
        return -1;
    }

    const highPriorityTasks = tasks.filter((t) => t.priority == Priority.High);
    highPriorityTasks.sort(sortFunc);
    const medPriorityTasks = tasks.filter((t) => t.priority == Priority.Med);
    medPriorityTasks.sort(sortFunc);
    const lowPriorityTasks = tasks.filter((t) => t.priority == Priority.Low);
    lowPriorityTasks.sort(sortFunc);

    // when you switch columns, recalculate the max number of rows, since columns may have a different number of rows
    useEffect(() => {
        let maxIndex = 0;
        switch (colIndex) {
            case 0:
                maxIndex = highPriorityTasks.length - 1;
                break;
            case 1:
                maxIndex = medPriorityTasks.length - 1;
                break;
            case 2:
                maxIndex = lowPriorityTasks.length - 1;
                break;
        }
        // for some reason rowIndex can be set to -1 at first.
        // I think this is because the ***PriorityTasks arrays may be empty at first?
        // this is a work-around until I figure out a better way to manage these arrays/indices
        maxIndex = Math.max(maxIndex, 0);
        if (rowIndex > maxIndex) {
            setRowIndex(maxIndex);
        }
    }, [colIndex]);

    const setIndices = () => {
        if (highPriorityTasks.length > 0) {
            setColIndex(0);
        } else if (medPriorityTasks.length > 0) {
            setColIndex(1);
        } else if (lowPriorityTasks.length > 0) {
            setColIndex(2);
        }
        setRowIndex(0);
    };

    const rowIndexMax = colIndex == 0 ? highPriorityTasks.length - 1 :
        colIndex == 1 ? medPriorityTasks.length - 1 : lowPriorityTasks.length - 1;

    const getSelectedTask = (): Task | undefined => {
        return colIndex == 0 ? highPriorityTasks[rowIndex] :
            colIndex == 1 ? medPriorityTasks[rowIndex] : lowPriorityTasks[rowIndex]
    }

    /** finds the index of the task in state. returns -1 if it fails to find it. */
    const selTaskStateIndex = (): number => {
        const taskID = getSelectedTask()?.id;
        if (!taskID) {
            return -1;
        }
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]?.id == taskID) {
                return i;
            } 
        }
        return -1;
    }

    const onEnter = () => {
        const selectedTask = getSelectedTask();

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
        completeTask(tasksCopy[taskIndex]);
        setTasks(tasksCopy);
    };

    const deleteTaskCallback = () => {
        const selectedTask = getSelectedTask();
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
        setShowDialog(true);
    };

    if (showDialog) {
        const selectInputProps = dialogProps as SelectInputProps;
        const oldCallback = selectInputProps.valueCallback;
        selectInputProps.valueCallback = (v: any) => {
            if (oldCallback) oldCallback(v);
            setShowDialog(false);
        }
        return (
            <SelectInput 
                {...selectInputProps} />
        )
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
                setCreatingTask(false);
            }}
            quitForm={() => setCreatingTask(false)} />
        )
    }

    return (
        <>
            <NavigationController 
                vertIndexSetter={setRowIndex}
                vertIndexMax={rowIndexMax}
                horizIndexSetter={setColIndex}
                horizIndexMax={2}
                onEnter={onEnter}
                keyBindings={new Map<string, Function>([
                    ['q', () => {setScreenFunc(Screens.MainMenu)}],
                    ['n', () => {setCreatingTask(true)}],
                    [' ', compTaskCallback],
                    ['x', deleteTaskCallback]
                ])}
                disabled={showDialog} />
            <Box flexDirection="column" width={"100%"} height={"100%"} minHeight={25}>
                <Text color={"magentaBright"}>Task Overview</Text>
                <Box flexDirection="row" margin={1} flexGrow={1} height={"100%"}>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"magenta"}
                        flexGrow={1}>
                            { highPriorityTasks.length > 0 ? highPriorityTasks.map((t, i) => {
                                const selected = colIndex == 0 && rowIndex == i;
                                return (
                                    <TaskBox selected={selected} key={t.id} {...t} />
                                );
                            }) : <Box margin={1}><Text color={"gray"}>No tasks</Text></Box>}
                    </Box>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"cyan"}
                        flexGrow={1}>
                            { medPriorityTasks.length > 0 ? medPriorityTasks.map((t, i) => {
                                const selected = colIndex == 1 && rowIndex == i;
                                return (
                                    <TaskBox selected={selected} key={t.id} {...t} />
                                );
                            }) : <Box margin={1}><Text color={"gray"}>No tasks</Text></Box>}
                    </Box>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"green"}
                        flexGrow={1}>
                            { lowPriorityTasks.length > 0 ? lowPriorityTasks.map((t, i) => {
                                const selected = colIndex == 2 && rowIndex == i;
                                return (
                                    <TaskBox selected={selected} key={t.id} {...t} />
                                );
                            }) : <Box margin={1}><Text color={"gray"}>No tasks</Text></Box>}
                    </Box>
                </Box>
                <Box marginX={2} flexDirection="row" justifyContent="space-between">
                    <Text color="magentaBright">"N" to create task</Text>

                    <Text color="cyanBright">"Enter" to edit task</Text>
                    
                    <Text color="greenBright">"Space" to complete task</Text>

                    <Text color="redBright">"X" to delete task</Text>

                    <Text color="gray">Arrow keys to move</Text>
                    
                    <Text color="gray">"Q" to exit</Text>
                </Box>
            </Box>
        </>
    );
}