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
    const appDataPath = getAppDataPath();
    if (!fs.existsSync(appDataPath)) {
        return [];
    }

    try {
        const data = fs.readFileSync(appDataPath, 'utf-8');
        return JSON.parse(data) as Task[];
    } catch (err) {
        console.error("error reading or parsing tasks file:", err);
        return [];
    }
}

export function saveTasks(tasks: Task[]) {
    ensureAppData();
    const appDataPath = getAppDataPath();
    try {
        fs.writeFileSync(appDataPath, JSON.stringify(tasks, null, 2));
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