import { Box, Text } from "ink";
import React, { useState } from "react";
import { Task } from "../../types.js";
import SubTaskTab from "./SubTaskTab.js";
import { Tab, Tabs } from "ink-tab";
import TaskNotes from "./TaskNotes.js";
import { isOverdue, isToday } from "../../util.js";

interface TaskDetailsProps {
    task: Task
    updateTask: (t: Task) => void
    closeTask: () => void
    parentTask?: Task
    completeTask: (t: Task) => void
}

export default function TaskDetails({task, updateTask, closeTask, completeTask}: TaskDetailsProps) {
    const [currentTab, setCurrentTab] = useState<string>('subtasks');

    const {title, desc, dueDate, subTasks, completed} = task;

    const updateNote = (note: string) => {
        const taskCopy = {...task};
        if (!taskCopy.notes) {
            taskCopy.notes = [];
        }
        taskCopy.notes.push(note);
        updateTask(taskCopy);
    };
    
    return (
        <>
            <Box margin={1} flexDirection="column">
                <Box flexDirection="row" justifyContent="space-between">
                <Text color={ completed ? "green" : "yellow" }>
                    {title}
                    { completed && <Text>{" ✓"}</Text> }
                </Text>
                </Box>
                <Text color={isOverdue(dueDate) ? "red" : isToday(dueDate) ? "magenta" : "cyan"}>{dueDate.toLocaleDateString()}</Text>
                { desc && <Text>{desc}</Text> }
                <Box justifyContent="center">
                    <Tabs onChange={(name) => setCurrentTab(name)} showIndex={false} defaultValue={currentTab}>
                        <Tab name="subtasks">{" Subtasks " + (subTasks?.length || 0 > 0 ? `(${subTasks?.length})` : '')}</Tab>
                        <Tab name="tasknotes">{" Notes "}</Tab>
                    </Tabs>
                </Box>
                { currentTab === 'subtasks' && 
                    <SubTaskTab subTasks={subTasks} completeTask={completeTask} closeTask={closeTask} />
                }
                { currentTab === 'tasknotes' && <TaskNotes closeTask={closeTask} updateNote={updateNote} notes={task.notes} /> }
            </Box>
            
        </>
    );
}