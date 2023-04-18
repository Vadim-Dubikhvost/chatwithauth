const {registration,login,getUsers} = require('../helpers/services/authService')


class AuthController{
	async registration(req, res){
		try{
			registration(req, res)
		} catch(e){
			console.error(e)
			res.status(400).json({message: "Registration error",status:1})
		}
	}

	async login(req, res){
		try{
			login(req, res)
		} catch(e){
			console.error(e)
			res.status(400).json({message: "Login error",status:1})
		}
	}

	async getUsers(req, res){
		try{
			getUsers(req, res)
		} catch(e){
			console.error(e)
		}
	}
}

module.exports = new AuthController()