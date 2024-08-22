import { Text } from "ink";
import React, { useState } from "react";
import TextArea from "../util/TextArea.js";
import NavigationController from "../util/NavigationController.js";
import Footer from "../util/Footer.js";

interface TaskNotesProps {
    closeTask: () => void
    updateNote: (note: string) => void
    notes?: string
}

export default function TaskNotes({closeTask, updateNote, notes}: TaskNotesProps) {
    const [noteText, setNoteText] = useState(notes || '');
    const [editMode, setEditMode] = useState(false);

    const handleEnter = () => {
        if (editMode) {
            // save whatever note text there is
            updateNote(noteText);
        }

        setEditMode((e) => !e);
    };

    return (
        <>
            <NavigationController
                onEnter={() => handleEnter()}
                keyBindings={new Map<string, Function>([
                    ['q', () => {
                        if (!editMode) closeTask();
                    }]
                ])} />
            <Text>Notes</Text>
            <TextArea 
                height={10} 
                value={noteText} 
                onChange={(v) => setNoteText(v)}
                borderProps={{
                    borderStyle: "double"
                }}
                onSubmit={() => setEditMode(false)}
                editMode={editMode} />
            <Footer actionDescs={[
                { keyBind: "Enter", shortDesc: editMode ? "Save note" : "Edit note", color: editMode ? "greenBright" : "cyanBright" },
                (!editMode ? { keyBind: "Q", shortDesc: "go back", color: "gray" } : { keyBind: "", shortDesc: "", color: "gray"})
            ]} />
        </>
    );
}