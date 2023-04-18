const Pool = require('pg').Pool
const pool = new Pool({
	user:"postgres",
	password:'18092002',
	host:'localhost',
	port:5432,
	database:"chat_with_auth"
})



module.exports = pool