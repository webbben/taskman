import React from "react";
import { Box, Text, useInput } from "ink";
import { ScreenProps, Screens } from "../../types.js";


export default function TaskView({setScreenFunc}:ScreenProps) {

    useInput((input, key) => {
		if (!key) return;

        if (input === 'q') {
            setScreenFunc(Screens.MainMenu)
        }
	});

    return (
        <Box flexDirection="column" width={"100%"} height={"100%"} minHeight={25}>
            <Text color={"magentaBright"}>Task Overview</Text>
            <Box flexDirection="row" margin={1} gap={1} flexGrow={1} height={"100%"}>
                <Box 
                    flexDirection="column" 
                    borderStyle={"round"} 
                    borderColor={"magenta"}
                    flexGrow={1}>
                </Box>
                <Box 
                    flexDirection="column" 
                    borderStyle={"round"} 
                    borderColor={"cyan"}
                    flexGrow={1}>
                </Box>
                <Box 
                    flexDirection="column" 
                    borderStyle={"round"} 
                    borderColor={"green"}
                    flexGrow={1}>
                </Box>
            </Box>
            <Text color="gray">Press "Q" to exit</Text>
        </Box>
    )
}