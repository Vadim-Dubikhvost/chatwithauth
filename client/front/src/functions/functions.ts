import React, { useEffect, useRef } from "react";
import { IMessages } from "../interfaces/interfaces";


interface IMessage {
	event: string,
	username?: string,
	message?: string
}

export const sndMessage = async (message: IMessage, socket: React.MutableRefObject<WebSocket>) => {
	await socket.current.send(JSON.stringify(message))
}

export const ScrollList = async (event: React.UIEvent<Element>/* UIEvent<HTMLDivElement> */, messages: IMessages[], socket: React.MutableRefObject<WebSocket>) => {
	const scrollTop = (event.target as Element).scrollTop/* .addEventListener('scroll', () => {
		if (event.pageYOffset === 0) {
			return 0
		}
	}) */
	if (scrollTop as unknown as number === 0 && messages.length) {

		let min = 999999;
		for (let i = 0; i < messages.length; i++) {
			if (messages[i].messageid < min) min = messages[i].messageid;
		}
		const message = {
			id: min,
			event: 'loadmessage'
		}
		await socket.current.send(JSON.stringify(message))

	}
}

export const usePrevious = (value: IMessages): IMessages | null => {
	const ref = useRef<IMessages>();
	useEffect(() => {
		ref.current = value;
	});
	if (ref.current !== undefined) {
		return ref.current
	}
	return null
}
