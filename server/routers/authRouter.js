const Router = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const {check} = require('express-validator')

router.post('/registration',[
	check('username', "Поле имени не может быть пустым").notEmpty(),
	check('password', "Пароль должен быть больше 5 и меньше 11 символов").isLength({min:5, max:11})
], controller.registration)
router.post('/login',controller.login)
router.get('/users',controller.getUsers)

module.exports = router