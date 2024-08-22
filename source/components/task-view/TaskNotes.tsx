import { Box, Text } from "ink";
import React, { useState } from "react";
import NavigationController from "../util/NavigationController.js";
import Footer from "../util/Footer.js";
import ScrollArea from "../util/ScrollArea.js";
import TextInput from "ink-text-input";

interface TaskNotesProps {
    closeTask: () => void
    updateNote: (note: string) => void
    notes?: string[]
}

export default function TaskNotes({closeTask, updateNote, notes}: TaskNotesProps) {
    const [curNote, setCurNote] = useState<string>('');
    const [editMode, setEditMode] = useState(false);

    const dateStr = new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    const handleEnter = () => {
        if (editMode && curNote != '') {
            // save whatever note text there is
            const finalizedNote = `${dateStr}\n${curNote}`;
            updateNote(finalizedNote);
        }
        setCurNote('');
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
            <ScrollArea height={10} borderStyle={"double"}>
                { notes && notes.map((n: string, i) => {
                    return (
                        <Box paddingBottom={1} key={"note_" + i}>
                            <Text>{n}</Text>
                        </Box>
                    );
                }) }
                { editMode && <Text>{dateStr}</Text>}
                { editMode && <Box><TextInput value={curNote} onChange={(s) => setCurNote(s)} /></Box> }
                <Box paddingTop={10}></Box>
            </ScrollArea>
            <Footer actionDescs={[
                { keyBind: "Enter", shortDesc: editMode ? "Save note" : "Edit note", color: editMode ? "greenBright" : "cyanBright" },
                (!editMode ? { keyBind: "Q", shortDesc: "go back", color: "gray" } : { keyBind: "", shortDesc: "", color: "gray"})
            ]} />
        </>
    );
}