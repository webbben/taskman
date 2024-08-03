
import { Task, Priority, TaskType } from "../../source/types.js";
import { createNewTask } from '../../source/backend/tasks.js';

const tasks: Task[] = [
    {
        id: "1",
        title: "Main Task 1",
        type: TaskType.Project,
        desc: "This is the main task 1",
        completed: false,
        priority: Priority.Med,
        dueDate: new Date("2024-08-10T00:00:00.000Z"),
        subTasks: [
            {
                id: "1-1",
                title: "Sub Task 1-1",
                type: TaskType.Task,
                desc: "This is sub task 1-1 of main task 1",
                completed: false,
                priority: Priority.Low,
                dueDate: new Date("2024-08-08T00:00:00.000Z"),
                parentID: "1"
            },
            {
                id: "1-2",
                title: "Sub Task 1-2",
                type: TaskType.TaskGroup,
                desc: "This is sub task 1-2 of main task 1",
                completed: false,
                priority: Priority.High,
                dueDate: new Date("2024-08-09T00:00:00.000Z"),
                parentID: "1",
                subTasks: [
                    {
                        id: "1-2-1",
                        title: "Sub Sub Task 1-2-1",
                        type: TaskType.Task,
                        desc: "This is sub sub task 1-2-1 of sub task 1-2",
                        completed: false,
                        priority: Priority.Med,
                        dueDate: new Date("2024-08-07T00:00:00.000Z"),
                        parentID: "1-2"
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        title: "Main Task 2",
        type: TaskType.TaskGroup,
        desc: "This is the main task 2",
        completed: false,
        priority: Priority.High,
        dueDate: new Date("2024-08-12T00:00:00.000Z"),
        subTasks: [
            {
                id: "2-1",
                title: "Sub Task 2-1",
                type: TaskType.Task,
                desc: "This is sub task 2-1 of main task 2",
                completed: false,
                priority: Priority.Med,
                dueDate: new Date("2024-08-11T00:00:00.000Z"),
                parentID: "2"
            }
        ]
    },
    {
        id: "3",
        title: "Main Task 3",
        type: TaskType.Task,
        desc: "This is the main task 3",
        completed: false,
        priority: Priority.Low,
        dueDate: new Date("2024-08-15T00:00:00.000Z")
    }
];

function getFutureDate(addDays: number): Date {
    const today = new Date();
    today.setDate(today.getDate() + addDays);
    return today;
}

interface TestResult {
    pass: boolean
    errorMsg?: string
}

function testAddTask(): TestResult {
    const tasksCopy = JSON.parse(JSON.stringify(tasks)) as Task[];
    createNewTask(
        tasksCopy,
        "new task",
        Priority.Low,
        getFutureDate(1),
        "a new task"
    );

    if (tasksCopy.length != 4) {
        return {
            pass: false,
            errorMsg: `tasks length incorrect. exp: 4, got: ${tasksCopy.length}`
        };
    }
    if (!tasksCopy[3]) {
        return {
            pass: false,
            errorMsg: "new task seems to be missing"
        };
    }
    if (tasksCopy[3].title !== "new task") {
        return {
            pass: false,
            errorMsg: `task title incorrect; exp: new task, got: ${tasksCopy[3].title}`
        };
    }
    return {
        pass: true
    };
}

function testAddSubTask(): TestResult {
    const tasksCopy = JSON.parse(JSON.stringify(tasks)) as Task[];
    createNewTask(
        tasksCopy,
        "new subtask",
        Priority.Low,
        getFutureDate(1),
        "a new task",
        '3'
    );

    if (tasksCopy.length != 3) {
        return {
            pass: false,
            errorMsg: `tasks length incorrect. exp: 3, got: ${tasksCopy.length}`
        };
    }
    if (!tasksCopy[2].subTasks || !tasksCopy[2].subTasks[0]) {
        return {
            pass: false,
            errorMsg: "subtask wasn't added to task 3"
        };
    }
    if (tasksCopy[2].subTasks[0].title !== "new subtask") {
        return {
            pass: false,
            errorMsg: `task title incorrect; exp: new subtask, got: ${tasksCopy[2].subTasks[0].title}`
        };
    }
    return {
        pass: true
    };
}

const tests = [
    testAddTask,
    testAddSubTask
];

for (const t of tests) {
    const r = t();
    if (!r.pass) {
        console.error("test case failed")
        console.error(r.errorMsg);
    }
}
console.log("task.ts: all tests finished.");