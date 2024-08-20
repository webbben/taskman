import { Box, DOMElement, measureElement, useInput } from "ink";
import React, { ReactNode } from "react";

interface ScrollAction {
    type: string
    innerHeight?: number
}

const reducer = (state: any, action: ScrollAction) => {
	switch (action.type) {
		case 'SET_INNER_HEIGHT':
			return {
				...state,
				innerHeight: action.innerHeight
			};

		case 'SCROLL_DOWN':
			return {
				...state,
				scrollTop: Math.min(
					state.innerHeight - state.height,
					state.scrollTop + 1
				)
			};

		case 'SCROLL_UP':
			return {
				...state,
				scrollTop: Math.max(0, state.scrollTop - 1)
			};

		default:
			return state;
	}
};

export interface BorderProps {
    borderStyle?: import("cli-boxes").BoxStyle | keyof import("cli-boxes").Boxes | undefined;
    borderTop?: boolean | undefined;
    borderBottom?: boolean | undefined;
    borderLeft?: boolean | undefined;
    borderRight?: boolean | undefined;
    borderColor?: import("type-fest").LiteralUnion<keyof import("ansi-styles").ForegroundColor, string> | undefined;
    borderTopColor?: import("type-fest").LiteralUnion<keyof import("ansi-styles").ForegroundColor, string> | undefined;
    borderBottomColor?: import("type-fest").LiteralUnion<keyof import("ansi-styles").ForegroundColor, string> | undefined;
    borderLeftColor?: import("type-fest").LiteralUnion<keyof import("ansi-styles").ForegroundColor, string> | undefined;
    borderRightColor?: import("type-fest").LiteralUnion<keyof import("ansi-styles").ForegroundColor, string> | undefined;
    borderDimColor?: boolean | undefined;
    borderTopDimColor?: boolean | undefined;
    borderBottomDimColor?: boolean | undefined;
    borderLeftDimColor?: boolean | undefined;
    borderRightDimColor?: boolean | undefined;
}

interface ScrollAreaProps extends BorderProps {
    height: number
    children: ReactNode | ReactNode[]
}

export default function ScrollArea({height, children, ...borderProps}: ScrollAreaProps) {
	const [state, dispatch] = React.useReducer(reducer, {
		height,
		scrollTop: 0
	});

	const innerRef = React.useRef<DOMElement>(null);

	React.useEffect(() => {
        if (!innerRef.current) {
            return;
        }
		const dimensions = measureElement(innerRef.current);

		dispatch({
			type: 'SET_INNER_HEIGHT',
			innerHeight: dimensions.height
		});
	}, []);

	useInput((_input, key) => {
		if (key.downArrow) {
			dispatch({
				type: 'SCROLL_DOWN'
			});
		}

		if (key.upArrow) {
			dispatch({
				type: 'SCROLL_UP'
			});
		}
	});

	return (
		<Box 
            height={height} 
            flexDirection="column" 
            overflow="hidden"
            {...borderProps}>
			<Box
				ref={innerRef}
				flexShrink={0}
				flexDirection="column"
				marginTop={-state.scrollTop}
			>
				{children}
			</Box>
		</Box>
	);
}