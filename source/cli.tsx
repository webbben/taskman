#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
//import meow from 'meow';
import App from './app.js';
import { ensureAppData } from './backend/tasks.js';

/*
const cli = meow(
	`
	Usage
	  $ taskman

	Options
		--name  Your name

	Examples
	  $ taskman --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
		},
	},
);
*/

// ensure app data files exist
ensureAppData();

render(<App />);
