import React, { useState } from 'react';
import MainMenu from './components/MainMenu.js';
import { Screens } from './types.js';
import TaskView from './components/task-view/TaskView.js';

export default function App() {

	const [screen, setScreen] = useState<Screens>(Screens.MainMenu);

	return (
		<>
			{ screen === Screens.MainMenu && <MainMenu setScreenFunc={setScreen} /> }
			{ screen === Screens.TaskView && <TaskView setScreenFunc={setScreen} /> }
		</>
	);
}
