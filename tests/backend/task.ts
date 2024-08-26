
import { Task, Priority } from "../../source/types.js";

const tasks: Task[] = [
    {
        id: "1",
        title: "Main Task 1",
        desc: "This is the main task 1",
        completed: false,
        priority: Priority.Med,
        dueDate: new Date("2024-08-10T00:00:00.000Z"),
        isSubtask: false,
        subTasks: [
            {
                id: "1-1",
                title: "Sub Task 1-1",
                desc: "This is sub task 1-1 of main task 1",
                completed: false,
                priority: Priority.Low,
                dueDate: new Date("2024-08-08T00:00:00.000Z"),
                parentID: "1",
                isSubtask: true
            },
            {
                id: "1-2",
                title: "Sub Task 1-2",
                desc: "This is sub task 1-2 of main task 1",
                completed: false,
                priority: Priority.High,
                dueDate: new Date("2024-08-09T00:00:00.000Z"),
                parentID: "1",
                isSubtask: true
            }
        ]
    },
    {
        id: "2",
        title: "Main Task 2",
        desc: "This is the main task 2",
        completed: false,
        priority: Priority.High,
        dueDate: new Date("2024-08-12T00:00:00.000Z"),
        isSubtask: false,
        subTasks: [
            {
                id: "2-1",
                title: "Sub Task 2-1",
                desc: "This is sub task 2-1 of main task 2",
                completed: false,
                priority: Priority.Med,
                dueDate: new Date("2024-08-11T00:00:00.000Z"),
                parentID: "2",
                isSubtask: true
            }
        ]
    },
    {
        id: "3",
        title: "Main Task 3",
        desc: "This is the main task 3",
        completed: false,
        priority: Priority.Low,
        dueDate: new Date("2024-08-15T00:00:00.000Z"),
        isSubtask: false
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