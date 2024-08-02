export interface ListItem {
	name: string
	callback: Function
}

export type Task = {
    id: number
    /** description of the task */
    desc: string
    /** whether or not this task is completed */
    completed: boolean
    /** the priority of this task */
    priority: Priority
    /** due date of the task */
    dueDate: Date
}

enum Priority {
    Low = 0,
    Med,
    High
}

export enum Screens {
	MainMenu = "main-menu",
	TaskView = "task-view"
}

export interface ScreenProps {
    setScreenFunc: React.Dispatch<React.SetStateAction<Screens>>
}