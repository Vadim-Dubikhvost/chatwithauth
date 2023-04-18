import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";
import { createStyles } from "@material-ui/styles";
import { IMessages } from "../../interfaces/interfaces";


const useStyles = makeStyles((theme) => createStyles({
	messageRow: {
		display: "flex"
	},
	messageRowRight: {
		display: "flex",
		justifyContent: "flex-end"
	},
	messageBlue: {
		position: "relative",
		marginLeft: "20px",
		marginBottom: "10px",
		padding: "10px",
		backgroundColor: "#A8DDFD",
		maxWidth: "60%",
		textAlign: "left",
		font: "400 .9em 'Open Sans', sans-serif",
		border: "1px solid #97C6E3",
		borderRadius: "10px",
		"&:after": {
			content: "''",
			position: "absolute",
			width: "0",
			height: "0",
			borderTop: "15px solid #A8DDFD",
			borderLeft: "15px solid transparent",
			borderRight: "15px solid transparent",
			top: "0",
			left: "-15px"
		},
		"&:before": {
			content: "''",
			position: "absolute",
			width: "0",
			height: "0",
			borderTop: "17px solid #97C6E3",
			borderLeft: "16px solid transparent",
			borderRight: "16px solid transparent",
			top: "-1px",
			left: "-17px"
		}
	},
	messageOrange: {
		position: "relative",
		marginRight: "20px",
		marginBottom: "10px",
		padding: "10px",
		backgroundColor: "#f8e896",
		maxWidth: "60%",
		textAlign: "left",
		font: "400 .9em 'Open Sans', sans-serif",
		border: "1px solid #dfd087",
		borderRadius: "10px",
		"&:after": {
			content: "''",
			position: "absolute",
			width: "0",
			height: "0",
			borderTop: "15px solid #f8e896",
			borderLeft: "15px solid transparent",
			borderRight: "15px solid transparent",
			top: "0",
			right: "-15px"
		},
		"&:before": {
			content: "''",
			position: "absolute",
			width: "0",
			height: "0",
			borderTop: "17px solid #dfd087",
			borderLeft: "16px solid transparent",
			borderRight: "16px solid transparent",
			top: "-1px",
			right: "-17px"
		}
	},

	messageContent: {
		padding: 0,
		marginRight: "35px",
		marginBottom: "15px",
	},
	messageTimeStampRight: {
		position: "absolute",
		fontSize: ".85em",
		fontWeight: 300,
		marginTop: "10px",
		bottom: "5px",
		right: "5px"
	},

	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500],
		width: theme.spacing(4),
		height: theme.spacing(4)
	},
	avatarNothing: {
		color: "transparent",
		backgroundColor: "transparent",
		width: theme.spacing(4),
		height: theme.spacing(4)
	},
	displayName: {
		marginLeft: "20px"
	}
})
)

interface MessagesProps {
	message: string,
	timestamp: string,
	displayName?: string
}

export const MessageLeft = React.forwardRef<HTMLDivElement, MessagesProps>((props, ref) => {
	const message = props.message ? props.message : "no message"
	const timestamp = props.timestamp ? props.timestamp : ""
	const displayName = props.displayName ? props.displayName : "Name"
	const classes = useStyles()
	return (
		<>
			<div className={classes.messageRow} ref={ref ? ref : null}>
				<div>
					<div className={classes.displayName}>{displayName}</div>
					<div className={classes.messageBlue}>
						<div>
							<p className={classes.messageContent}>{message}</p>
						</div>
						<div className={classes.messageTimeStampRight}>{timestamp}</div>
					</div>
				</div>
			</div>
		</>
	)
})

export const MessageRight = React.forwardRef<HTMLDivElement, MessagesProps>((props, ref) => {
	const classes = useStyles()
	const message = props.message ? props.message : "no message"
	const timestamp = props.timestamp ? props.timestamp : ""
	return (
		<div className={classes.messageRowRight} ref={ref ? ref : null}>
			<div className={classes.messageOrange}>
				<p className={classes.messageContent}>{message}</p>
				<div className={classes.messageTimeStampRight}>{timestamp}</div>
			</div>
		</div>
	)
})

interface MessageProps {
	mess: IMessages;
	messages: IMessages[];
	username: string;
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(({ mess, messages, username, ...props }, ref) => {
	const time = useMemo(() => {
		return `${new Date(Number(mess.time)).getHours()}:${new Date(Number(mess.time)).getMinutes()}:${new Date(Number(mess.time)).getSeconds()}`
	}, [mess.time])

	const isLastMessage = mess.messageid === messages[messages.length - 1].messageid;

	return (
		<div>
			{mess.username === username ? <MessageRight
				{...(isLastMessage ? { ref } : {})} ref={ref}
				message={mess.message}
				timestamp={time}
				displayName={mess.username}
			/>
				: <MessageLeft
					{...(isLastMessage ? { ref } : {})} ref={ref}
					message={mess.message}
					timestamp={time}
					displayName={mess.username}
				/>}
		</div>
	)
})
