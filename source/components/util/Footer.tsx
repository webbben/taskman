import { ForegroundColorName } from "chalk";
import { Box, Text } from "ink";
import React from "react";

interface ActionDesc {
    keyBind: string
    shortDesc: string
    color: ForegroundColorName
}

interface FooterProps {
    actionDescs: ActionDesc[]
}

export default function Footer({actionDescs}: FooterProps) {
    return (
        <>
            <Box flexDirection="row" flexWrap="wrap" marginTop={2}>
                {
                    actionDescs.map((ad, i) => {
                        return (
                            <Box marginRight={4} marginBottom={1} key={"ad_" + i}>
                                <Text color={ad.color}>{`${ad.keyBind} - ${ad.shortDesc}`}</Text>
                            </Box>
                        );
                    })
                }
            </Box>
        </>
    );
}