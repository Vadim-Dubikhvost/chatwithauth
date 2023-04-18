const express = require('express')
const http = require('http')
const ws = require('ws')
const authRouter = require('./routers/authRouter')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const DataBase = require('./DataBase')

const AUTH = 'auth'
const SERVER = 'Server'

const PORT = process.env.PORT || 4200

const app = express()

app.use(cors({ origin: 'http://localhost:3000' , credentials :  true}));
app.use(express.json())
app.use('/auth', authRouter)

const server = http.createServer(app)
const wss = new ws.Server({server: server}, ()=>{console.log(`WebSocket server started att port ${PORT}`);})

const getUserByToken = async (token) =>{
	const candidate = await DataBase.query(`SELECT username FROM users WHERE token = $1`,[token])
	if(candidate){
		return candidate
	} else{
		return null
	}
}

const broadcastMessage = (message) =>{
	wss.clients.forEach(client => {
		client.send(JSON.stringify(message))
	})
}

const sendMessages = async (ws) => {
	const mess = await DataBase.query(`SELECT * FROM messages ORDER BY messageid desc LIMIT 15`)
	const message = {
		rows:mess.rows.reverse()
	}
	ws.send(JSON.stringify(message))
}


const start = async () => {
	try{
		wss.on('connection',(ws)=>{
			const state = {
				user: null,
			}
			ws.on('message', async (message)=>{
				message = JSON.parse(message)
				if (state.user === null) {
					if (message.event !== AUTH) {
						ws.send('{"error": "First message must be AUTH"}');
						ws.close();
						return;
					}
					const user = await getUserByToken(message.token);

					if (!user.rows.length) {
						ws.send('{"error":"Ti kto voobsche???777"}');
						ws.close();
						return;
					}
					state.user = user;
					const addMessage = await DataBase.query(`INSERT INTO messages (username, message,time) values ($1, $2,$3) RETURNING *`,
					[SERVER,`User ${user.rows[0].username} connected`,Date.now()])
					return;
				}
				switch(message.event) {
					case 'message':
						const addMessage = await DataBase.query(`INSERT INTO messages (username, message,time) values ($1, $2,$3) RETURNING *`,
						[message.username,message.message,Date.now()])
						
						broadcastMessage({rows: addMessage.rows})
						break
					case 'loadmessage':

						const msg = await DataBase.query(`SELECT * FROM messages WHERE messageid < $1 ORDER BY messageid desc LIMIT 5`,
						[message.id])

						const loadMessages ={
							rows:msg.rows,
							event : 'loadMessages'
						}
						ws.send(JSON.stringify(loadMessages))
						
						break 
					case 'connection':
						sendMessages(ws)
						break
				}
			})
		})
		server.listen(PORT, () =>{
			console.log(`Server started at port ${PORT}`);
		})
	} catch(e){
		console.log(e);
	}
}

start()