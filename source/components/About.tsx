import { Box, Text } from "ink";
import React from "react";
import { getAppDataPath } from "../backend/tasks.js";
import NavigationController from "./util/NavigationController.js";
import { ScreenProps, Screens } from "../types.js";
import Footer from "./util/Footer.js";

export default function About({ setScreenFunc }: ScreenProps) {
    return (
        <>
            <NavigationController keyBindings={new Map<string, Function>([
                ['q', () => {setScreenFunc(Screens.MainMenu)}]
            ])} />
            <Box margin={1} gap={1} flexDirection="column">
                <Text color={'cyanBright'}>About Taskmonger</Text>
                <Text>Github: <Text color={"blueBright"}>https://github.com/webbben/taskmonger</Text></Text>
                <Text>Data path: <Text color={"blueBright"}>{getAppDataPath()}</Text></Text>
                <Footer actionDescs={[{ keyBind: 'Q', shortDesc: 'back', color: 'gray' }]} />
            </Box>
            
        </>
    );
}