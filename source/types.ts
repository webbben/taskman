
export interface ListItem {
	name: string
	callback: Function
}

export type Task = {
    id: string
    /** title of the task */
    title: string
    /** description of the task */
    desc?: string
    /** whether or not this task is completed */
    completed: boolean
    /** the date this task was completed */
    completionDate?: Date
    /** the priority of this task */
    priority: Priority
    /** due date of the task */
    dueDate: Date
    /**
     * Sub-tasks to complete before this main task is considered complete.
     * There can only be a single layer of depth in subTasks - you can't have multiple nested subtasks.
     */
    subTasks?: Task[]
    isSubtask: boolean
    /** ID of parent task, if one exists */
    parentID?: string
    /** Category of this task */
    category?: Category
    /** notes for this task over time */
    notes?: string[]
}

export type Category = {
    /** full name of category */
    name: string
    /** short abbreviation of the category name; a few capital letters */
    label: string
    /** color of the category tag */
    color: CategoryColor
}

export enum CategoryColor {
    red = "red",
    blue = "blue",
    green = "green",
    orange = "orange",
    purple = "purple"
}

export enum Priority {
    Low = 'low',
    Med = 'medium',
    High = 'high'
}

export enum Screens {
	MainMenu = "main-menu",
	TaskView = "task-view",
    About = "about"
}

export interface ScreenProps {
    setScreenFunc: React.Dispatch<React.SetStateAction<Screens>>
}