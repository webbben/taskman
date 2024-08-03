export interface ListItem {
	name: string
	callback: Function
}

export type Task = {
    id: number
    /** title of the task */
    title: string
    /** description of the task */
    desc?: string
    /** whether or not this task is completed */
    completed: boolean
    /** the priority of this task */
    priority: Priority
    /** due date of the task */
    dueDate: Date
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