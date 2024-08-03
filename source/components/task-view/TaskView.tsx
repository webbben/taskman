import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { Priority, ScreenProps, Screens, Task } from "../../types.js";
import { loadTasks } from "../../backend/tasks.js";
import TaskBox from "./TaskBox.js";
import NavigationController from "../util/NavigationController.js";

export default function TaskView({setScreenFunc}:ScreenProps) {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [colIndex, setColIndex] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);

    useEffect(() => {
        (async () => {
            setTasks(loadTasks())
        })()
    }, []);

    const highPriorityTasks = tasks.filter((t) => t.priority == Priority.High);
    const medPriorityTasks = tasks.filter((t) => t.priority == Priority.Med);
    const lowPriorityTasks = tasks.filter((t) => t.priority == Priority.Low);

    const rowIndexMax = colIndex == 0 ? highPriorityTasks.length :
        colIndex == 1 ? medPriorityTasks.length : lowPriorityTasks.length;
    
    const selectedTaskID = colIndex == 0 ? highPriorityTasks[rowIndex]?.id :
        colIndex == 1 ? medPriorityTasks[rowIndex]?.id : lowPriorityTasks[rowIndex]?.id;

    return (
        <>
            <NavigationController 
                vertIndexSetter={setRowIndex}
                vertIndexMax={rowIndexMax}
                horizIndexSetter={setColIndex}
                horizIndexMax={3} 
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
                            { highPriorityTasks.map((t, _) => {
                                return (
                                    <TaskBox selected={t.id === selectedTaskID} key={t.id} {...t} />
                                );
                            })}
                    </Box>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"cyan"}
                        flexGrow={1}>
                            { medPriorityTasks.map((t, _) => {
                                return (
                                    <TaskBox selected={t.id === selectedTaskID} key={t.id} {...t} />
                                );
                            })}
                    </Box>
                    <Box 
                        flexDirection="column" 
                        borderStyle={"round"} 
                        borderColor={"green"}
                        flexGrow={1}>
                            { lowPriorityTasks.map((t, _) => {
                                return (
                                    <TaskBox selected={t.id === selectedTaskID} key={t.id} {...t} />
                                );
                            })}
                    </Box>
                </Box>
                <Text color="gray">Press "Q" to exit</Text>
            </Box>
        </>
    )
}