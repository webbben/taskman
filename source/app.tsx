import React, { useState } from 'react';
import {Box, Text, useInput} from 'ink';

interface ListItem {
	name: string
	callback: Function
}

export default function App() {

	const [listIndex, setListIndex] = useState(0);
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

	const listUp = () => {
		if (listIndex == 0) {
			setListIndex(listItems.length - 1);
			return;
		}
		setListIndex((li) => li - 1);
	};
	const listDown = () => {
		if (listIndex >= listItems.length - 1) {
			setListIndex(0);
			return;
		}
		setListIndex((li) => li + 1);
	};

	useInput((_, key) => {
		if (!key) return;

		if (key.upArrow) {
			listUp();
		} else if (key.downArrow) {
			listDown();
		} else if (key.return) {
			listItems[listIndex]?.callback();
		}
	});

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<Text color="green">{"TASKMAN"}</Text>
				<Text color="blueBright">{" - a task manager app"}</Text>
			</Box>
			{ listItems.map((li, i) => {
				return (
					<Text 
						key={"op" + i}
						color={listIndex == i ? "green" : "gray"}>{`${i+1}: ${li.name}`}</Text>
				);
			})}
		</Box>
	);
}
