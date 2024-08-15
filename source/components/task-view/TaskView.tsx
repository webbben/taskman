import React, { useEffect, useState } from "react";
import { Box } from "ink";
import { Priority, ScreenProps, Task } from "../../types.js";
import { createNewTask, deleteTask, loadTasks, subtaskCount, toggleCompleteTask } from "../../backend/tasks.js";
import TaskTab from "./TaskTab.js";
import { Tab, Tabs } from "ink-tab";
import Footer from "../util/Footer.js";
import SelectInput, { SelectInputProps } from "../util/SelectInput.js";
import TaskDetails from "./TaskDetails.js";
import CreateTaskForm from "./CreateTaskForm.js";

export default function TaskView({setScreenFunc}:ScreenProps) {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [colIndex, setColIndex] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);

    const [openedTask, setOpenedTask] = useState<Task>();
    const [creatingTask, setCreatingTask] = useState(false);
    const [showingDialog, setShowingDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState<Object>({});

    const [activeTabName, setActiveTabName] = useState<string>('highPriority');

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

    const deleteTaskCallback = (task: Task) => {
        const titleDisp = task.title.length > 15 ? task.title.substring(0, 15) + "..." : task.title;

        const selectInputProps: SelectInputProps = {
            prompt: `Delete task? (title: ${titleDisp}, subTasks: ${subtaskCount(task)})`,
            options: [
                { label: "Yes (delete)", val: true },
                { label: "No (don't delete)", val: false}
            ],
            valueCallback: (v: boolean) => {
                if (v) {
                    const tasksCopy = [...tasks];
                    // TODO: why is tasksCopy not modified by deleteTask? I have to return the new tasks list for some reason.
                    const newTasks = deleteTask(task, tasksCopy);
                    setTasks(newTasks);
                }
            }
        };
        setDialogProps(selectInputProps);
        setShowingDialog(true);
    }

    const compTaskCallback = (task: Task) => {
        const tasksCopy = [...tasks];
        toggleCompleteTask(task, tasksCopy, !task.completed);
        setTasks(tasksCopy);
    }

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

    if (showingDialog) {
        const selectInputProps = dialogProps as SelectInputProps;
        const oldCallback = selectInputProps.valueCallback;
        selectInputProps.valueCallback = (v: any) => {
            if (oldCallback) oldCallback(v);
            setShowingDialog(false);
        };
        return (
            <SelectInput 
                {...selectInputProps} />
        );
    }

    if (openedTask) {
        return (
            <TaskDetails {...openedTask} closeTask={() => setOpenedTask(undefined)} />
        );
    }

    if (creatingTask) {
        return (
            <CreateTaskForm onCreateTask={(ti) => {
                (async () => {
                    const tasksCopy = [...tasks];
                    createNewTask(tasksCopy, ti.title, ti.priority, ti.dueDate, ti.desc, ti.parentTaskID, ti.category);
                    setTasks(tasksCopy);
                })();
                setCreatingTask(false);
            }}
            quitForm={() => setCreatingTask(false)}
            tasks={tasks} />
        );
    }

    const passTabProps = {
        setScreenFunc,
        setTasks,
        allTasks: tasks,
        setOpenedTask,
        delTask: deleteTaskCallback,
        compTask: compTaskCallback,
        showCreateTaskForm: () => setCreatingTask(true)
    };

    const handleChangeTab = (name: string) => {
        setActiveTabName(name);
    }

    return (
        <>
            <Box flexDirection="column" margin={1}>
                <Box justifyContent="center">
                    <Tabs onChange={(name) => handleChangeTab(name)} showIndex={false} defaultValue={activeTabName}>
                        <Tab name="highPriority">{" High " + (highPriorityTasks.length > 0 ? `(${highPriorityTasks.length})` : '')}</Tab>
                        <Tab name="medPriority">{" Med " + (medPriorityTasks.length > 0 ? `(${medPriorityTasks.length})` : '')}</Tab>
                        <Tab name="lowPriority">{" Low " + (lowPriorityTasks.length > 0 ? `(${lowPriorityTasks.length})` : '')}</Tab>
                    </Tabs>
                </Box>
                { activeTabName == 'highPriority' && 
                    <TaskTab
                        tabTasks={highPriorityTasks} 
                        title="High Priority Tasks"
                        {...passTabProps} /> }
                { activeTabName == 'medPriority' && 
                    <TaskTab 
                        tabTasks={medPriorityTasks} 
                        title="Medium Priority Tasks"
                        {...passTabProps} /> }
                { activeTabName == 'lowPriority' && 
                    <TaskTab 
                        tabTasks={lowPriorityTasks} 
                        title="Low Priority Tasks"
                        {...passTabProps} /> }
                
                <Footer actionDescs={[
                    {shortDesc: "create task", keyBind: "N", color: "magentaBright"},
                    {shortDesc: "edit task", keyBind: "Enter", color: "cyanBright"},
                    {shortDesc: "complete task", keyBind: "Space", color: "greenBright"},
                    {shortDesc: "delete task", keyBind: "X", color: "redBright"},
                    {shortDesc: "exit", keyBind: "Q", color: "gray"}
                ]} />
            </Box>
        </>
    );
}