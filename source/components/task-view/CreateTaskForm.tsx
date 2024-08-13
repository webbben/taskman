import { Form, FormProps } from "ink-form";
import React from "react";
import { Priority } from "../../types.js";
import { Text } from "ink";
import NavigationController from "../util/NavigationController.js";

interface CreateTaskFormProps {
    onCreateTask?: (task: CreatedTaskInfo) => void
    quitForm: Function
}

type CreateTaskResult = {
    priority: Priority
    title: string
    desc?: string
    dueDateMonth: number
    dueDateDay: number
    dueDateYear: number
}

type CreatedTaskInfo = {
    title: string
    priority: Priority
    desc?: string
    dueDate: Date
}

export default function CreateTaskForm({onCreateTask, quitForm}: CreateTaskFormProps) {
    const options = [
        { label: 'High', value: Priority.High },
        { label: 'Medium', value: Priority.Med },
        { label: 'Low', value: Priority.Low },
    ]

    const today = new Date();

    const formProps: FormProps = {
        form: {
            title: "Create New Task",
            sections: [
                {
                    title: "Task Info",
                    fields: [
                        {
                            type: 'string',
                            name: 'title',
                            label: 'Title',
                            required: true
                        },
                        {
                            type: 'select',
                            name: 'priority',
                            label: 'Priority',
                            options,
                            initialValue: Priority.Med,
                            required: true
                        },
                        {
                            type: 'string',
                            name: 'desc',
                            label: 'Description',
                        }
                    ]
                },
                {
                    title: "Due Date",
                    fields: [
                        {
                            type: 'integer',
                            name: 'dueDateMonth',
                            label: 'Month',
                            initialValue: today.getMonth() + 1,
                            required: true
                        },
                        {
                            type: 'integer',
                            name: 'dueDateDay',
                            label: 'Day',
                            initialValue: today.getDate(),
                            required: true
                        },
                        {
                            type: 'integer',
                            name: 'dueDateYear',
                            label: 'Year',
                            initialValue: today.getFullYear(),
                            required: true
                        },
                    ]
                }
            ]
        }
    };

    return (
        <>
            <NavigationController 
                keyBindings={new Map<string, Function>([
                    ['q', quitForm]
                ])} />
            <Form 
                {...formProps}
                onSubmit={(result) => {
                    const r = result as CreateTaskResult;
                    const createdTaskInfo: CreatedTaskInfo = {
                        title: r.title,
                        desc: r.desc,
                        priority: r.priority,
                        dueDate: new Date(r.dueDateYear, r.dueDateMonth - 1, r.dueDateDay)
                    }
                    if (onCreateTask) {
                        onCreateTask(createdTaskInfo);
                    } else {
                        console.log(result);
                    }
                }} />
            <Text color={"gray"}>Press "Q" to quit</Text>
        </>
    );
}