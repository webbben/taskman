import React, { useEffect, useState } from "react";
import { Box } from "ink";
import { Priority, ScreenProps, Task } from "../../types.js";
import { loadTasks } from "../../backend/tasks.js";
import TaskTab from "./TaskTab.js";
import { Tab, Tabs } from "ink-tab";
import Footer from "../util/Footer.js";

export default function TaskView({setScreenFunc}:ScreenProps) {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [colIndex, setColIndex] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    const [disableTabNav, setDisableTabNav] = useState(false);

    const [activeTabName, setActiveTabName] = useState<string>('highPriority');
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
    };

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

    return (
        <>
            <Box flexDirection="column" margin={1}>
                <Box justifyContent="center">
                    { !disableTabNav && <Tabs onChange={(name) => setActiveTabName(name)} showIndex={false}>
                        <Tab name="highPriority">{` High (${highPriorityTasks.length}) `}</Tab>
                        <Tab name="medPriority">{` Med (${medPriorityTasks.length}) `}</Tab>
                        <Tab name="lowPriority">{` Low (${lowPriorityTasks.length}) `}</Tab>
                    </Tabs> }
                </Box>
                { activeTabName == 'highPriority' && 
                    <TaskTab 
                        setDisableTabNav={setDisableTabNav}
                        setScreenFunc={setScreenFunc} 
                        tasks={highPriorityTasks} 
                        title="High Priority Tasks"
                        setTasks={setTasks} /> }
                { activeTabName == 'medPriority' && 
                    <TaskTab 
                        setDisableTabNav={setDisableTabNav}
                        tasks={medPriorityTasks} 
                        title="Medium Priority Tasks"
                        setScreenFunc={setScreenFunc}
                        setTasks={setTasks} /> }
                { activeTabName == 'lowPriority' && 
                    <TaskTab 
                        setDisableTabNav={setDisableTabNav}
                        tasks={lowPriorityTasks} 
                        title="Low Priority Tasks"
                        setScreenFunc={setScreenFunc}
                        setTasks={setTasks} /> }
                
                { !disableTabNav && <Footer actionDescs={[
                    {shortDesc: "create task", keyBind: "N", color: "magentaBright"},
                    {shortDesc: "edit task", keyBind: "Enter", color: "cyanBright"},
                    {shortDesc: "complete task", keyBind: "Space", color: "greenBright"},
                    {shortDesc: "delete task", keyBind: "X", color: "redBright"},
                    {shortDesc: "exit", keyBind: "Q", color: "gray"}
                ]} /> }
            </Box>
        </>
    );
}