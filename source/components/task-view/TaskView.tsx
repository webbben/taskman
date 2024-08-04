import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { Priority, ScreenProps, Screens, Task } from "../../types.js";
import { loadTasks } from "../../backend/tasks.js";
import TaskBox from "./TaskBox.js";
import NavigationController from "../util/NavigationController.js";
import TaskDetails from "./TaskDetails.js";

export default function TaskView({setScreenFunc}:ScreenProps) {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [colIndex, setColIndex] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    const [openedTask, setOpenedTask] = useState<Task>()

    useEffect(() => {
        (async () => {
            setTasks(loadTasks())
        })()
    }, []);

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

    const rowIndexMax = colIndex == 0 ? highPriorityTasks.length - 1 :
        colIndex == 1 ? medPriorityTasks.length - 1 : lowPriorityTasks.length - 1;

    const onEnter = () => {
        const selectedTask = colIndex == 1 ? highPriorityTasks[rowIndex] :
            colIndex == 2 ? medPriorityTasks[rowIndex] : lowPriorityTasks[rowIndex]

        if (!selectedTask) {
            console.error("selected task not found!");
            return;
        }
        setOpenedTask(selectedTask);
    };

    if (openedTask) {
        return (
            <TaskDetails {...openedTask} setOpenedTask={setOpenedTask} />
        );
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
                    ['q', () => {setScreenFunc(Screens.MainMenu)}]
                ])}/>
            <Box flexDirection="column" width={"100%"} height={"100%"} minHeight={25}>
                <Text color={"magentaBright"}>Task Overview</Text>
                <Box flexDirection="row" margin={1} flexGrow={1} height={"100%"}>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"magenta"}
                        flexGrow={1}>
                            { highPriorityTasks.map((t, i) => {
                                const selected = colIndex == 0 && rowIndex == i;
                                return (
                                    <TaskBox selected={selected} key={t.id} {...t} />
                                );
                            })}
                    </Box>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"cyan"}
                        flexGrow={1}>
                            { medPriorityTasks.map((t, i) => {
                                const selected = colIndex == 1 && rowIndex == i;
                                return (
                                    <TaskBox selected={selected} key={t.id} {...t} />
                                );
                            })}
                    </Box>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"green"}
                        flexGrow={1}>
                            { lowPriorityTasks.map((t, i) => {
                                const selected = colIndex == 2 && rowIndex == i;
                                return (
                                    <TaskBox selected={selected} key={t.id} {...t} />
                                );
                            })}
                    </Box>
                </Box>
                <Box marginX={2} flexDirection="row" justifyContent="space-between">
                    <Text color="cyanBright">"Enter" to edit task</Text>
                    
                    <Text color="greenBright">"Space" to complete task</Text>

                    <Text color="redBright">"X" to delete task</Text>
                    
                    <Text color="gray">"Q" to exit</Text>
                </Box>
            </Box>
        </>
    );
}