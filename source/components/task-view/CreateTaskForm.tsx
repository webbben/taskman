import { Form, FormProps } from "ink-form";
import React, { useEffect, useState } from "react";
import { Category, CategoryColor, Priority } from "../../types.js";
import { Text } from "ink";
import NavigationController from "../util/NavigationController.js";
import { createNewCategory, loadCategories } from "../../backend/tasks.js";

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
    newCategoryName?: string
    newCategoryLabel?: string
    newCategoryColor?: CategoryColor
    category?: string
}

type CreatedTaskInfo = {
    title: string
    priority: Priority
    desc?: string
    dueDate: Date
    category?: Category
}

export default function CreateTaskForm({onCreateTask, quitForm}: CreateTaskFormProps) {
    const priorityOptions = [
        { label: 'High', value: Priority.High },
        { label: 'Medium', value: Priority.Med },
        { label: 'Low', value: Priority.Low },
    ];
    const colorOptions = Object.values(CategoryColor).map(color => ({
        label: color, value: color
    }));

    const today = new Date();

    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        (async () => {
            let cats = loadCategories();
            cats.push({ name: "None", label: "X", color: CategoryColor.blue });
            setCategories(cats);
        })();
    }, []);

    const categoryOptions = categories?.map(c => ({
        label: `${c.name} (${c.label})`, value: c.name
    }));

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
                            options: priorityOptions,
                            initialValue: Priority.Med,
                            required: true
                        },
                        {
                            type: 'string',
                            name: 'desc',
                            label: 'Description',
                        },
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
                            required: true,
                        },
                    ]
                },
                {
                    title: "Category",
                    fields: [
                        {
                            type: 'select',
                            name: 'category',
                            label: 'Existing Category',
                            options: categoryOptions,
                            initialValue: "None",
                            description: "Choose from existing categories on other tasks. If you choose an existing category, the fields for creating a new one will be ignored."
                        },
                        {
                            type: 'string',
                            name: 'newCategoryName',
                            label: 'New Category Name',
                            description: "Create a new category from scratch; You can only create a new category if no existing category is selected above."
                        },
                        {
                            type: 'string',
                            name: 'newCategoryLabel',
                            label: 'New Category Label'
                        },
                        {
                            type: 'select',
                            name: 'newCategoryColor',
                            label: 'New Category Color',
                            options: colorOptions
                        }
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
                        // handle category creation
                        if (r.category && r.category != "None") {
                            createdTaskInfo.category = categories?.find((c) => c.name == r.category);
                        } else {
                            if (r.newCategoryName && r.newCategoryLabel && r.newCategoryColor) {
                                createdTaskInfo.category = {
                                    name: r.newCategoryName, label: r.newCategoryLabel, color: r.newCategoryColor
                                }
                                createNewCategory(categories || [], createdTaskInfo.category);
                            }
                        }
                        onCreateTask(createdTaskInfo);
                    } else {
                        console.log(result);
                    }
                }} />
            <Text color={"gray"}>Press "Q" to quit</Text>
        </>
    );
}