import os from 'os';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';
import { Priority, Task, TaskType } from '../types.js';

const appName = 'taskman';

export function ensureAppData() {
    const appDataPath = getAppDataPath();

    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
    }
}

export function loadTasks(): Task[] {
    const filename = getTasksJsonPath();
    if (!fs.existsSync(filename)) {
        return [];
    }

    try {
        const data = fs.readFileSync(filename, 'utf-8');
        const taskData = JSON.parse(data) as Task[];
        for (const task of taskData) {
            task.dueDate = new Date(task.dueDate);
        }
        return taskData;
    } catch (err) {
        console.error("error reading or parsing tasks file:", err);
        return [];
    }
}

export function saveTasks(tasks: Task[]) {
    ensureAppData();
    const filename = getTasksJsonPath();
    try {
        fs.writeFileSync(filename, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error("error saving tasks:", err);
    }
}

export function deleteTask(taskToDelete: Task, taskList: Task[]): Task[] {
    // if this is a subtask of another task, find the parent task and remove it from its subtasks.
    if (taskToDelete.parentID) {
        const success = findTaskAndApplyAction(taskToDelete.parentID, taskList, (t: Task) => {
            if (!t.subTasks) {
                console.error("delete task: parent task doesn't have a sub task?");
                return;
            }
            if (t.subTasks.length == 1) {
                t.subTasks = undefined;
                return;
            }
            t.subTasks = t.subTasks.filter((t: Task) => t.id !== taskToDelete.id);
        });
        if (!success) {
            console.log("failed to delete task");
        }
    } else {
        taskList = taskList.filter((t: Task) => t.id !== taskToDelete.id);
    }
    saveTasks(taskList);
    return taskList;
}

export function subtaskCount(task: Task): number {
    if (!task.subTasks || task.subTasks.length == 0) {
        return 0;
    }
    let count = 0;
    for (const subtask of task.subTasks) {
        count++;
        count += subtaskCount(subtask);
    }
    return count;
}

/**
 * Creates a new task, inserts it into the given tasks list, and saves to the disk. The input tasks list will have the new task inserted into it.
 * @param currentTasks list of tasks we currently already have
 * @param title title of new task
 * @param priority priority of new task
 * @param dueDate due date of new task
 * @param desc (OPT) description of new task
 * @param parentID (OPT) ID of parent task, if this is a sub-task
 */
export function createNewTask(currentTasks: Task[], title: string, priority: Priority, dueDate: Date, desc?: string, parentID?: string) {
    const task: Task = {
        title,
        priority,
        dueDate,
        type: TaskType.Task,
        completed: false,
        id: generateUID()
    };

    if (desc) {
        task.desc = desc;
    }
    if (parentID) {
        task.parentID = parentID;
    }
    if (!insertTask(currentTasks, task)) {
        console.error(`failed to insert task ${task.id}`);
        if (task.parentID) {
            console.error(`does parent task ${task.parentID} exist?`);
        }
    }
    // save new tasks to disk
    saveTasks(currentTasks);
}

function insertTask(tasks: Task[], newTask: Task): boolean {
    if (!newTask.parentID) {
        tasks.push(newTask);
        return true;
    }
    for (const task of tasks) {
        if (task.id === newTask.parentID) {
            task.subTasks = task.subTasks || [];
            task.subTasks.push(newTask);
            return true;
        }

        if (task.subTasks && insertTask(task.subTasks, newTask)) {
            return true;
        }
    }
    return false;
}

export function completeTask(task: Task) {
    recursiveTaskAction(task, (t: Task) => {
        t.completed = true;
        return true;
    });
}

export function uncompleteTask(task: Task) {
    recursiveTaskAction(task, (t: Task) => {
        t.completed = false;
        return true;
    });
}

/**
 * performs an action on all tasks below the given task recursively
 * @param task task node to start from - all subtasks below will be recursively acted upon
 * @param callbackAction action to apply to each task. if this callback action returns false, recursion will stop on the current branch.
 * @returns 
 */
function recursiveTaskAction(task: Task, callbackAction: (t: Task) => boolean) {
    const processSubtasks = callbackAction(task);
    if (!processSubtasks) return;

    if (task.subTasks) {
        for (const subTask of task.subTasks) {
            recursiveTaskAction(subTask, callbackAction);
        }
    }
}

/**
 * finds a task in the taskList and applies a specified function to it.
 * @param taskID ID of the task we are looking to apply a function to
 * @param taskList 
 * @param callbackAction function to apply to the task
 * @returns true if task was successfully found and acted upon, or false if not.
 */
function findTaskAndApplyAction(taskID: string, taskList: Task[], callbackAction: (t: Task) => void): boolean {
    for (const task of taskList) {
        if (dfsTaskAction(task, taskID, callbackAction)) {
            return true;
        }
    }
    return false;
}

/**
 * find a specific task (under this branch) and apply an action to it. 
 * @param task task node we will start searching from
 * @param taskID task we are searching for
 * @param callbackAction action to apply to the task once its found
 * @returns true if the task has been found and had its action applied - which signals end of dfs.
 */
function dfsTaskAction(task: Task, taskID: string, callbackAction: (t: Task) => void): boolean {
    if (task.id === taskID) {
        callbackAction(task);
        return true;
    }

    if (task.subTasks) {
        for (const subTask of task.subTasks) {
            if (dfsTaskAction(subTask, taskID, callbackAction)) {
                return true;
            }
        }
    }
    return false;
}

function generateUID() {
    return randomBytes(16).toString('hex');
}

function getAppDataPath(): string {
    const homeDir = os.homedir();

    switch (os.platform()) {
        case 'darwin':
            return path.join(homeDir, 'Library', 'Application Support', appName);
        case 'win32':
            return path.join(process.env['APPDATA'] || path.join(homeDir, 'AppData', 'Roaming'), appName);
        case 'linux':
            return path.join(homeDir, '.local', 'share', appName)
        default:
            throw new Error('Unsupported platform: ' + os.platform());
    }
}

function getTasksJsonPath(): string {
    const appDataPath = getAppDataPath();
    return path.join(appDataPath, "tasks.json");
}