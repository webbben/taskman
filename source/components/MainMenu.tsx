import React from "react";
import { Box, Text } from "ink";
import Menu from "./menu/Menu.js";
import { ListItem, ScreenProps, Screens } from "../types.js";
import { exit } from "../backend/system.js";


export default function MainMenu({setScreenFunc}:ScreenProps) {
    const listItems: ListItem[] = [
		{
			name: "Current Tasks",
			callback: () => { setScreenFunc(Screens.TaskView) }
		},
		{
			name: "Past Tasks",
			callback: () => { console.log("Past Tasks: coming soon!") }
		},
		{
			name: "About",
			callback: () => { setScreenFunc(Screens.About) }
		},
		{
			name: "Exit",
			callback: exit
		},
	]

    return (
        <Box flexDirection="column" padding={1}>
			<Box flexDirection="row" paddingBottom={1}>
				<Text color="green">{"TaskMonger"}</Text>
				<Text color="blueBright">{" - a task manager app"}</Text>
			</Box>
			<Menu items={listItems} />
		</Box>
    );
}