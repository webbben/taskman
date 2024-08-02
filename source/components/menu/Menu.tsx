import React, { useState } from "react";
import { ListItem } from "../../types.js";
import { Box, useInput } from "ink";
import MenuItem from "./MenuItem.js";

export interface MenuProps {
    items: ListItem[]
}

export default function Menu({items}: MenuProps) {

    const [listIndex, setListIndex] = useState(0);

    const listUp = () => {
		if (listIndex == 0) {
			setListIndex(items.length - 1);
			return;
		}
		setListIndex((li) => li - 1);
	};
	const listDown = () => {
		if (listIndex >= items.length - 1) {
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
			items[listIndex]?.callback();
		}
	});

    return (
        <Box flexDirection="column">
        { items.map((li, i) => {
            return (
                <MenuItem key={"menu_"+i} item={li} index={i} selected={i == listIndex} />
            );
        })}
        </Box>
    );
}