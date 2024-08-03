import React, { useState } from "react";
import { ListItem } from "../../types.js";
import { Box } from "ink";
import MenuItem from "./MenuItem.js";
import NavigationController from "../util/NavigationController.js";

export interface MenuProps {
    items: ListItem[]
}

export default function Menu({items}: MenuProps) {
    const [listIndex, setListIndex] = useState(0);

    const onEnterCallback = () => {
        items[listIndex]?.callback();
    };

    return (
        <>
            <NavigationController 
                vertIndexSetter={setListIndex} 
                vertIndexMax={items.length} 
                onEnter={onEnterCallback} />
            <Box flexDirection="column">
            { items.map((li, i) => {
                return (
                    <MenuItem key={"menu_"+i} item={li} index={i} selected={i == listIndex} />
                );
            }) }
            </Box>
        </>
    );
}