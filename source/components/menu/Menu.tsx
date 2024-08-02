import React, { useState } from "react";
import { ListItem } from "../../types.js";
import { Text, useInput } from "ink";

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
        <>
        { items.map((li, i) => {
            return (
                <Text 
                    key={"op" + i}
                    color={listIndex == i ? "green" : "gray"}>{`${i+1}: ${li.name}`}</Text>
            );
        })}
        </>
    );
}