import React from 'react';
import { Text } from "ink";
import { ListItem } from "../../types.js";

interface MenuItemProps {
    item: ListItem
    index: number
    selected: boolean
}

export default function MenuItem({item, index, selected}:MenuItemProps) {
    return (
        <Text
            color={selected ? "green" : "gray"}>{`${index+1}: ${item.name}`}</Text>
    );
}