import { Box, Text } from "ink";
import React, { useState } from "react";
import { Task } from "../../types.js";
import SubTaskTab from "./SubTaskTab.js";
import { Tab, Tabs } from "ink-tab";
import TaskNotes from "./TaskNotes.js";
import { isOverdue, isToday } from "../../util.js";
import NavigationController from "../util/NavigationController.js";
import Footer from "../util/Footer.js";

interface TaskDetailsProps {
    task: Task
    updateTask: (t: Task) => void
    closeTask: () => void
    parentTask?: Task
    completeTask: (t: Task) => void
    setEditingTask: (t: Task) => void
    deleteTask: (t: Task) => void
}

export default function TaskDetails({task, updateTask, closeTask, completeTask, setEditingTask, deleteTask}: TaskDetailsProps) {
    const [currentTab, setCurrentTab] = useState<string>('details');

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
                { task.category && <Box borderStyle={"round"} borderColor={task.category.color}><Text color={task.category.color}>{`${task.category.name} (${task.category.label})`}</Text></Box>}
                </Box>
                <Text color={isOverdue(dueDate) ? "red" : isToday(dueDate) ? "magenta" : "cyan"}>{dueDate.toLocaleDateString()}</Text>
                <Box justifyContent="center">
                    <Tabs onChange={(name) => setCurrentTab(name)} showIndex={false} defaultValue={currentTab}>
                        <Tab name="details">{" Details "}</Tab>
                        <Tab name="subtasks">{" Subtasks " + (subTasks?.length || 0 > 0 ? `(${subTasks?.length})` : '')}</Tab>
                        <Tab name="tasknotes">{" Notes "}</Tab>
                    </Tabs>
                </Box>
                { currentTab === 'details' && 
                    <>
                        <NavigationController keyBindings={new Map<string, Function>([
                            ['q', closeTask],
                            ['e', () => setEditingTask(task)]
                        ])} />
                        <Box marginTop={1}>
                            { desc && <Text>{desc}</Text> }
                        </Box>
                        <Footer actionDescs={[
                            {keyBind: 'E', shortDesc: 'edit task', color: 'cyanBright'},
                            {keyBind: 'Q', shortDesc: 'go back', color: 'gray'}
                        ]} />
                    </>
                }
                { currentTab === 'subtasks' && 
                    <SubTaskTab 
                        subTasks={subTasks} 
                        completeTask={completeTask} 
                        closeTask={closeTask}
                        deleteTask={deleteTask}
                        editTask={setEditingTask} />
                }
                { currentTab === 'tasknotes' && <TaskNotes closeTask={closeTask} updateNote={updateNote} notes={task.notes} /> }
            </Box>
            
        </>
    );
}