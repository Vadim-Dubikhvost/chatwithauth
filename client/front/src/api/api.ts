import axios from "axios";
import { IResponse } from "../interfaces/interfaces";

let instance = axios.create({
	baseURL: "http://localhost:4200/auth/"
})

export const API = {
	regNewUser(username: string, password: string): Promise<IResponse> {
		return instance.post('registration', { username, password }).then(response => response.data)
	},

	login(username: string, password: string): Promise<IResponse> {
		return instance.post('/login', { username, password }).then(response => response.data)
	},

}