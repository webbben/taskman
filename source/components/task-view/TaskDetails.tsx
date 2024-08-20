import { Box, Text } from "ink";
import React, { useState } from "react";
import { Task } from "../../types.js";
import NavigationController from "../util/NavigationController.js";
import SubTaskTab from "./SubTaskTab.js";
import { Tab, Tabs } from "ink-tab";
import TaskNotes from "./TaskNotes.js";

interface TaskDetailsProps extends Task {
    closeTask: Function
    parentTask?: Task
    completeTask: (t: Task) => void
}

export default function TaskDetails({title, desc, dueDate, subTasks, completed, closeTask, completeTask}: TaskDetailsProps) {
    const [currentTab, setCurrentTab] = useState<string>('subtasks');
    
    return (
        <>
            <NavigationController
                keyBindings={new Map<string, Function>([
                    ['q', closeTask]
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
                <Box justifyContent="center">
                    <Tabs onChange={(name) => setCurrentTab(name)} showIndex={false} defaultValue={currentTab}>
                        <Tab name="subtasks">{" Subtasks " + (subTasks?.length || 0 > 0 ? `(${subTasks?.length})` : '')}</Tab>
                        <Tab name="tasknotes">{" Notes "}</Tab>
                    </Tabs>
                </Box>
                { currentTab === 'subtasks' && 
                    <SubTaskTab subTasks={subTasks} completeTask={completeTask} />
                }
                { currentTab === 'tasknotes' && <TaskNotes /> }
            </Box>
            
        </>
    );
}