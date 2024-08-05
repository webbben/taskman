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