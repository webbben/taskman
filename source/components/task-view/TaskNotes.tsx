import { Text } from "ink";
import React, { useState } from "react";
import TextArea from "../util/TextArea.js";
import NavigationController from "../util/NavigationController.js";
import Footer from "../util/Footer.js";

export default function TaskNotes() {
    const [noteText, setNoteText] = useState('');
    const [editMode, setEditMode] = useState(false);

    return (
        <>
            <NavigationController
                onEnter={() => {
                    if (!editMode) {
                        setEditMode(true);
                    }
                }} />
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
                { keyBind: "Enter", shortDesc: editMode ? "Save note" : "Edit note", color: editMode ? "greenBright" : "cyanBright" }
            ]} />
        </>
    );
}