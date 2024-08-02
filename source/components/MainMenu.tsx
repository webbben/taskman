import React from "react";
import { Box, Text } from "ink";
import Menu from "./menu/Menu.js";
import { ListItem, ScreenProps, Screens } from "../types.js";


export default function MainMenu({setScreenFunc}:ScreenProps) {
    const listItems: ListItem[] = [
		{
			name: "View Tasks",
			callback: () => { setScreenFunc(Screens.TaskView) }
		},
		{
			name: "About",
			callback: () => {}
		},
		{
			name: "Exit",
			callback: process.exit
		},
	]

    return (
        <Box flexDirection="column" padding={1}>
			<Box flexDirection="row" paddingBottom={1}>
				<Text color="green">{"TASKMAN"}</Text>
				<Text color="blueBright">{" - a task manager app"}</Text>
			</Box>
			<Menu items={listItems} />
		</Box>
    );
}