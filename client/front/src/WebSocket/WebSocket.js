const AUTH = 'auth'

export const connect = (socket,token, setIsAuthed,setMessages) => {

	socket.current = new WebSocket('ws://localhost:4200')

	socket.current.onopen = () => {
		const message = {
			event: AUTH,
			token
		}
		setTimeout(() => {
			socket.current.send(JSON.stringify(message))
		}, 1000)
	}

	socket.current.onmessage = (event) => {
		const message = JSON.parse(event.data)

		if(message.event === 'loadMessages'){
			setMessages(prev => [...message.rows.reverse(),...prev])
		}else{
			setMessages(prev => [...prev,...message.rows])
		}

		
	}

	socket.current.onclose = () => {

		setIsAuthed(false)
	}

	socket.current.onerror = () => {
 
	}

}