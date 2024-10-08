import React, { useEffect, useState } from "react";
import { Box } from "ink";
import { Priority, ScreenProps, Task } from "../../types.js";
import { createNewTask, deleteTask, loadTasks, subtaskCount, toggleCompleteTask, updateAndSaveSingleTask, updateTaskPriority } from "../../backend/tasks.js";
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
    const [editTask, setEditTask] = useState<Task>();
    const [showingDialog, setShowingDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState<Object>({});

    const [activeTabName, setActiveTabName] = useState<string>('highPriority');

    useEffect(() => {
        (async () => {
            const today = new Date();
            const isSameDay = (d1: Date, d2: Date) => {
                
                return d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate();
            }
            // load incomplete tasks, or completed tasks that are from today
            setTasks(loadTasks().filter((t) => (t.completed && t.completionDate && isSameDay(t.completionDate, today)) || !t.completed));
        })();
    }, []);

    useEffect(() => {
        setIndices();
    }, [tasks]);

    const sortFunc = (a: Task, b: Task) => {
        if (a.dueDate < b.dueDate) {
            return -1;
        }
        return 1;
    };

    const highPriorityTasks = tasks.filter((t) => t.priority == Priority.High && !t.completed);
    highPriorityTasks.sort(sortFunc);
    const medPriorityTasks = tasks.filter((t) => t.priority == Priority.Med && !t.completed);
    medPriorityTasks.sort(sortFunc);
    const lowPriorityTasks = tasks.filter((t) => t.priority == Priority.Low && !t.completed);
    lowPriorityTasks.sort(sortFunc);
    const completedTasks = tasks.filter((t) => t.completed);
    completedTasks.sort(sortFunc);

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

    const changeTaskPriorityCallback = (t: Task) => {
        const titleDisp = t.title.length > 15 ? t.title.substring(0, 15) + "..." : t.title;

        const selectInputProps: SelectInputProps = {
            prompt: `Select new priority for task (title: ${titleDisp})\n(Current priority: ${t.priority})`,
            options: [
                { label: "High", val: Priority.High },
                { label: "Med", val: Priority.Med },
                { label: "Low", val: Priority.Low },
                { label: "(Cancel)", val: '' }
            ],
            valueCallback: (v: string) => {
                if (v == '' || v == t.priority) {
                    return;
                }
                const tasksCopy = [...tasks];
                updateTaskPriority(t, v as Priority, tasksCopy);
                setTasks(tasksCopy);
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
        // ensure that the dialog will be closed on callback
        selectInputProps.valueCallback = (v: any) => {
            if (oldCallback) oldCallback(v);
            setShowingDialog(false);
        };
        return (
            <SelectInput {...selectInputProps} />
        );
    }

    const updateTask = (t: Task) => {
        const tasksCopy = [...tasks];
        updateAndSaveSingleTask(t, tasksCopy);
        setTasks(tasksCopy);
    };

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

    if (editTask) {
        return (
            <CreateTaskForm onEditTask={(ti, ot) => {
                (async () => {
                    const tasksCopy = [...tasks];
                    const updatedTask = {...ot};
                    updatedTask.category = ti.category;
                    updatedTask.title = ti.title;
                    updatedTask.priority = ti.priority;
                    updatedTask.desc = ti.desc;
                    updatedTask.dueDate = ti.dueDate;
                    updatedTask.parentID = ti.parentTaskID;
                    updateAndSaveSingleTask(updatedTask, tasksCopy);
                })();
                setEditTask(undefined);
            }}
            editTask={editTask}
            quitForm={() => setEditTask(undefined)}
            tasks={tasks} />
        );
    }

    if (openedTask) {
        return (
            <TaskDetails
                updateTask={updateTask}
                task={openedTask}
                closeTask={() => setOpenedTask(undefined)}
                completeTask={compTaskCallback}
                setEditingTask={(t) => setEditTask(t)}
                deleteTask={deleteTaskCallback} />
        );
    }

    const passTabProps = {
        setScreenFunc,
        setTasks,
        allTasks: tasks,
        setOpenedTask,
        delTask: deleteTaskCallback,
        changePriority: changeTaskPriorityCallback,
        compTask: compTaskCallback,
        showCreateTaskForm: () => setCreatingTask(true)
    };

    const handleChangeTab = (name: string) => {
        setActiveTabName(name);
    };

    return (
        <>
            <Box flexDirection="column" margin={1}>
                <Box justifyContent="center">
                    <Tabs onChange={(name) => handleChangeTab(name)} showIndex={false} defaultValue={activeTabName}>
                        <Tab name="highPriority">{" High " + (highPriorityTasks.length > 0 ? `(${highPriorityTasks.length})` : '')}</Tab>
                        <Tab name="medPriority">{" Med " + (medPriorityTasks.length > 0 ? `(${medPriorityTasks.length})` : '')}</Tab>
                        <Tab name="lowPriority">{" Low " + (lowPriorityTasks.length > 0 ? `(${lowPriorityTasks.length})` : '')}</Tab>
                        <Tab name="completed">{" Comp " + (completedTasks.length > 0 ? `(${completedTasks.length})` : '')}</Tab>
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
                { activeTabName == 'completed' && 
                    <TaskTab 
                        tabTasks={completedTasks} 
                        title="Completed Tasks"
                        {...passTabProps} /> }
                
                <Footer actionDescs={[
                    {shortDesc: "create task", keyBind: "N", color: "blueBright"},
                    {shortDesc: "view task", keyBind: "Enter", color: "cyanBright"},
                    {shortDesc: "complete task", keyBind: "Space", color: "greenBright"},
                    {shortDesc: "change priority", keyBind: "P", color: "magentaBright"},
                    {shortDesc: "delete task", keyBind: "X", color: "redBright"},
                    {shortDesc: "back", keyBind: "Q", color: "gray"}
                ]} />
            </Box>
        </>
    );
}