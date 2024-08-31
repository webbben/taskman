import { Priority, Task } from "../types.js";
import { __setTaskJsonFilename, createNewTask, deleteTask, getTask, updateAndSaveSingleTask } from "./tasks.js";

interface TaskValuesToCheck {
    title?: string
    priority?: Priority
    dueDate?: Date
    desc?: string,
    parentID?: string
}

function checkTaskValues(t: Task, comp: TaskValuesToCheck) {
    for (const key in comp) {
        if (t.hasOwnProperty(key)) {
            expect(t[key as keyof Task]).toBe(comp[key as keyof TaskValuesToCheck]);
        }
    }
}

function checkTaskExists(taskID: string, taskList: Task[]): Task {
    const t = getTask(taskID, taskList);
    if (!t) throw new Error('failed to find task');
    return t;
}

describe('sanity check', () => {
    test('1 + 1 = 2', () => expect(1 + 1).toBe(2));
});

describe('creating, updating and deleting tasks', () => {
    __setTaskJsonFilename("test_tasks");
    let currentTasks: Task[] = [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    test('creating basic task', () => {
        createNewTask(currentTasks, 'test-task-1', Priority.Med, today);
        expect(currentTasks.length).toStrictEqual(1);
        checkTaskValues(currentTasks[0]!, {title: 'test-task-1', priority: Priority.Med });
    });
    test('create task with description', () => {
        createNewTask(currentTasks, 'test-task-2', Priority.High, today, "a simple description");
        expect(currentTasks.length).toStrictEqual(2);
        checkTaskValues(currentTasks[1]!, { title: 'test-task-2', priority: Priority.High, desc: 'a simple description' });
    });
    test('create a sub-task', () => {
        const id = createNewTask(currentTasks, 'sub-task-1', Priority.Med, today, "", currentTasks[0]!.id);
        expect(currentTasks.length).toStrictEqual(2); // adding sub task shouldn't increase task list size
        const t = checkTaskExists(id, currentTasks);
        checkTaskValues(t, { parentID: currentTasks[0]!.id, title: 'sub-task-1', priority: Priority.Med, dueDate: today });
    });
    test('create a sub-task with a later date', () => {
        createNewTask(currentTasks, 'sub-task-2', Priority.Med, tomorrow, "", currentTasks[0]!.id);
        // confirm parent task has its due date updated, since the sub-task has a later due date
        expect(currentTasks[0]!.dueDate, 'due date of parent was not updated correctly').toEqual(tomorrow);
    });
    test('update parent task due date to be earlier', () => {
        const updatedTask = {...currentTasks[0]!};
        updatedTask.dueDate = today;
        updateAndSaveSingleTask(updatedTask, currentTasks);
        const t = checkTaskExists(updatedTask.id, currentTasks);
        // confirm that subtasks had their due dates cut off at no later than parent task due date
        for (const subtask of t.subTasks!) {
            if (subtask.dueDate > t.dueDate) {
                throw new Error('subtask should not have a later due date than parent task');
            }
        }
    });
    test('delete all tasks', () => {
        for (const t of currentTasks) {
            currentTasks = deleteTask(t, currentTasks);
        }
        expect(currentTasks.length).toStrictEqual(0);
    });
});