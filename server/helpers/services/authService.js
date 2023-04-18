const DataBase = require('../../DataBase')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../../config')

const generateAccessToken = (id) =>{
	const payload = {
		id
	}

	return jwt.sign(payload,secret, {expiresIn:'24h'})
}

const registration = async(req,res) =>{
	const errors = validationResult(req)

	if(!errors.isEmpty()){
		return res.status(400).json({message: "Error", errors})
	}

	const{username,password} = req.body
	const candidate = await DataBase.query(`SELECT username FROM users WHERE username = $1`,[username])
	if(!(candidate.rowCount === 0)){
		return res.status(400).json({message: "Пользователь уже существует",status:1})
	}

	const hashPass = bcrypt.hashSync(password,2)

	const addUser = await DataBase.query(`INSERT INTO users (username, pass) values ($1, $2) RETURNING *`, [username,hashPass])

	return res.json({status:0})

}

const login = async(req,res) =>{
	const{username,password} = req.body
	const user = await DataBase.query(`SELECT * FROM users WHERE username = $1`,[username])

	if(user.rowCount === 0){
		return res.json({message: `Пользователь ${username} не существует`,status:1	})
	}

	const validPassword = bcrypt.compareSync(password, user.rows[0].pass)

	if(!validPassword){
		return res.status(400).json({message: `Неверный пароль`,status:1})  
	}

	const token = generateAccessToken(user.rows[0].id)

	const addUser = await DataBase.query(`UPDATE users SET token = $1 WHERE username = $2 RETURNING *`, [token,username])

	return res.json({token,username,status:0})

}

const getUsers = async(req,res) => {
	const users = await DataBase.query(`SELECT * FROM users`)

	return res.json(users.rows)
}

module.exports = {
	registration,
	login,
	getUsers,
}
