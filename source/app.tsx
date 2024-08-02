import React, { useState } from 'react';
import {Box, Text, useInput} from 'ink';
import { ListItem } from './types.js';
import Menu from './components/menu/Menu.js';



export default function App() {

	const listItems: ListItem[] = [
		{
			name: "View Tasks",
			callback: () => { }
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
