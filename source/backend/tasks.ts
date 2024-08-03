import os from 'os';
import path from 'path';
import fs from 'fs';
import { Task } from '../types.js';

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