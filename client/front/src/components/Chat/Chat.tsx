import { makeStyles, Paper } from '@material-ui/core'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { connect } from '../../WebSocket/WebSocket'
import { Message } from './Message'
import { TextInput } from './TextInput'
import { useInView } from 'react-intersection-observer'
import { IMessages } from '../../interfaces/interfaces'
import { ScrollButton } from './ScrollButton'
import { ScrollList, sndMessage, usePrevious } from '../../functions/functions'

const useStyles = makeStyles({
	paper: {
		width: "100%",
		height: "100%",
		maxWidth: "500px",
		maxHeight: "700px",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		position: "relative",
		margin: "0 auto"
	},
	paper2: {
		width: "80vw",
		maxWidth: "500px",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		position: "relative"
	},
	container: {
		width: "1200px",
		height: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	messagesBody: {
		width: "calc( 100% - 20px )",
		margin: 10,
		overflowY: "scroll",
		height: "calc( 100% - 80px )"
	},
	scrollButton: {
		position: "absolute",
		bottom: "15%",
		right: "10%",
		color: "white",
		backgroundColor: "blue",
		borderRadius: "50%",
		width: "40px",
		height: "40px",
		cursor: "pointer"
	},
	arrow: {
		width: "20px",
		height: "20px",
		margin: "0 auto",
		marginLeft: "1px",
		marginTop: "2px"
	},
	uncheckedMessages: {
		width: "20px",
		height: "20px",
		position: "absolute",
		bottom: "15%",
		right: "10%",
		color: "black",
		backgroundColor: "#f8e896",
		borderRadius: "50%",
		fontSize: "12px",
		zIndex: 1,
		textAlign: "center",
		fontWeight: "bold",
	},
	counter: {
		marginTop: "3px",
		marginLeft: "1px"
	}
}
)

interface ChatProps {
	isAuthed: any;
	setIsAuthed(isAuthed: boolean): any;
	username: string;
}

const Chat: React.FC<ChatProps> = ({ isAuthed, setIsAuthed, username, ...props }) => {
	const [value, setValue] = useState<string>('')
	const [messages, setMessages] = useState<Array<IMessages>>([])
	const [showButton, setShowButton] = useState<boolean>(false)
	const [scrollHeight, setScrollHeight] = useState<number>(0)
	const [uncheckedMessageCounter, setUncheckedMessageCounter] = useState<number>(0)
	const socket = useRef<WebSocket>()
	const ChatBlock = useRef<MutableRefObject<HTMLDivElement>>()
	const classes = useStyles()
	const prevLastMessagesElement = usePrevious(messages[messages.length - 1])
	const [ref, inView] = useInView({
		threshold: 0
	})

	const token = window.localStorage.getItem('token')

	const sendMessageFunc = useCallback((message, socket) => sndMessage(message, socket), [])

	const RefNotUndefined = (Ref: React.MutableRefObject<React.MutableRefObject<HTMLDivElement> | undefined>) => {
		if (Ref.current !== undefined) {
			return Ref.current as unknown as HTMLDivElement
		}
		return Ref.current as unknown as HTMLDivElement
	}

	const scrollDown = useCallback(() => {
		if (showButton === true) {
			RefNotUndefined(ChatBlock).scrollTo(0, RefNotUndefined(ChatBlock).scrollHeight)
			setShowButton(false)
			setUncheckedMessageCounter(0)
		}
	}, [ChatBlock, showButton])

	const onScrollList = useCallback((e: any, messages: IMessages[], socket: React.MutableRefObject<WebSocket>) => {
		ScrollList(e, messages, socket)
	}, [])


	useEffect(() => {
		if (isAuthed === true && messages.length === 0) {
			connect(socket, token, setIsAuthed, setMessages)
			setTimeout(() => {
				RefNotUndefined(ChatBlock).scrollTo(0, RefNotUndefined(ChatBlock).scrollHeight)
			}, 1600)
		}
		const message = {
			event: 'connection'
		}
		setTimeout(() => {
			if (isAuthed === true && messages.length === 0) {
				sendMessageFunc(message, socket)
			}
		}, 1500)
	}, [isAuthed, token, socket, setIsAuthed, setMessages, messages, ChatBlock, sendMessageFunc])

	useEffect(() => {
		(RefNotUndefined(ChatBlock).onscroll = () => {
			setScrollHeight((RefNotUndefined(ChatBlock).scrollHeight - RefNotUndefined(ChatBlock).scrollTop - 620))
		})
		if (scrollHeight > 200) {
			setShowButton(true)
		}
		if (scrollHeight < 200) {
			setShowButton(false)
		}
	}, [scrollHeight, setScrollHeight])

	useEffect(() => {
		if (inView === true && prevLastMessagesElement !== messages[messages.length - 1]) {
			RefNotUndefined(ChatBlock).scrollTo(0, RefNotUndefined(ChatBlock).scrollHeight)
		}
	}, [inView, ChatBlock, prevLastMessagesElement, messages])

	useEffect(() => {
		if (showButton === true && prevLastMessagesElement !== messages[messages.length - 1]) {
			setUncheckedMessageCounter(uncheckedMessageCounter + 1)
		}
	}, [showButton, prevLastMessagesElement, messages, setUncheckedMessageCounter, uncheckedMessageCounter])

	const sendMessage = useCallback(async (e: SubmitEvent | React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		const message = {
			username,
			message: value,
			event: 'message'
		}
		let olol = socket as unknown as MutableRefObject<WebSocket>
		await olol.current.send(JSON.stringify(message))
		setValue('')
		setTimeout(() => {
			RefNotUndefined(ChatBlock).scrollTo(0, RefNotUndefined(ChatBlock).scrollHeight)
			setUncheckedMessageCounter(0)
		}, 200)

	}, [socket, ChatBlock, username, value])

	return (
		<>
			<div className={classes.container}>
				<Paper className={classes.paper} onScroll={e => onScrollList(e, [messages[0]], socket as unknown as MutableRefObject<WebSocket>)}>
					<Paper id="style-1" className={classes.messagesBody}
						onScroll={e => onScrollList(e, messages, socket as unknown as MutableRefObject<WebSocket>)} ref={ChatBlock}>
						{messages.map((mess, i) => {
							return <Message key={mess.messageid} mess={mess} messages={messages} username={username} ref={ref} />
						})
						}
						{
							(showButton === true) ?
								<ScrollButton classes={classes} scrollDown={scrollDown} uncheckedMessageCounter={uncheckedMessageCounter} />
								: null
						}
					</Paper>
					<TextInput sendMessage={sendMessage} value={value} setValue={setValue} />
				</Paper>
			</div>

		</>
	)
}

export default Chat