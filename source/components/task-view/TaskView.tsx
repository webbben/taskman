import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import { Priority, ScreenProps, Screens, Task } from "../../types.js";
import { loadTasks } from "../../backend/tasks.js";
import TaskBox from "./TaskBox.js";

export default function TaskView({setScreenFunc}:ScreenProps) {

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        (async () => {
            setTasks(loadTasks())
        })()
    }, []);

    useInput((input, key) => {
		if (!key) return;

        if (input === 'q') {
            setScreenFunc(Screens.MainMenu)
        }
	});

    return (
        <Box flexDirection="column" width={"100%"} height={"100%"} minHeight={25}>
            <Text color={"magentaBright"}>Task Overview</Text>
            <Box flexDirection="row" margin={1} gap={1} flexGrow={1} height={"100%"}>
                <Box 
                    flexDirection="column" 
                    borderStyle={"round"} 
                    borderColor={"magenta"}
                    flexGrow={1}>
                        { tasks.map((t, _) => {
                            if (t.priority !== Priority.High) {
                                return;
                            }
                            return (
                                <TaskBox key={t.id} {...t} />
                            );
                        })}
                </Box>
                <Box 
                    flexDirection="column" 
                    borderStyle={"round"} 
                    borderColor={"cyan"}
                    flexGrow={1}>
                        { tasks.map((t, _) => {
                            if (t.priority !== Priority.Med) {
                                return;
                            }
                            return (
                                <TaskBox key={t.id} {...t} />
                            );
                        })}
                </Box>
                <Box 
                    flexDirection="column" 
                    borderStyle={"round"} 
                    borderColor={"green"}
                    flexGrow={1}>
                        { tasks.map((t, _) => {
                            if (t.priority !== Priority.Low) {
                                return;
                            }
                            return (
                                <TaskBox key={t.id} {...t} />
                            );
                        })}
                </Box>
            </Box>
            <Text color="gray">Press "Q" to exit</Text>
        </Box>
    )
}