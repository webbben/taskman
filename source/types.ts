export interface ListItem {
	name: string
	callback: Function
}

export type Task = {
    id: string
    /** title of the task */
    title: string
    /** the type of this task; determined by its depth of sub-tasks */
    type: TaskType
    /** description of the task */
    desc?: string
    /** whether or not this task is completed */
    completed: boolean
    /** the priority of this task */
    priority: Priority
    /** due date of the task */
    dueDate: Date
    /**
     * Sub-tasks to complete before this main task is considered complete.
     * The number of levels of tasks below a given task (it's "depth") determines its "type":
     * - depth 0: task
     * - depth 1: task group
     * - depth 2: project
     * - depth 3: mega project
     */
    subTasks?: Task[]
    /** ID of parent task, if one exists */
    parentID?: string
}

export enum TaskType {
    Task = 'task',
    TaskGroup = 'task-group',
    Project = 'project',
    MegaProject = 'mega-project'
}

export enum Priority {
    Low = 'low',
    Med = 'medium',
    High = 'high'
}

export enum Screens {
	MainMenu = "main-menu",
	TaskView = "task-view"
}

export interface ScreenProps {
    setScreenFunc: React.Dispatch<React.SetStateAction<Screens>>
}