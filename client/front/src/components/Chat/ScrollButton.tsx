import React from 'react'
import ArrowDown from "../../assets/arrow_down.svg"

interface ScrollButtonProps {
	classes: any;
	scrollDown(): void;
	uncheckedMessageCounter: number;
}

export const ScrollButton: React.FC<ScrollButtonProps> = ({ classes, scrollDown, uncheckedMessageCounter, ...props }) => {
	return (
		<div>
			<button className={classes.scrollButton} onClick={scrollDown}>
				<img src={ArrowDown} alt="" className={classes.arrow} />
			</button>
			{uncheckedMessageCounter > 0 ?
				<div className={classes.uncheckedMessages}><p className={classes.counter}>{uncheckedMessageCounter}</p></div>
				: null}
		</div>
	)
}