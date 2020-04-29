const sqlite = require('sqlite3')

const db = new sqlite.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS users(
	id INTEGER PRIMARY KEY,
	name TEXT,
	picture TEXT ,
	email TEXT , 
	password TEXT
)`)

exports.getAllUsers = function(callback){
	
	const query = "SELECT * FROM users ORDER BY id"
	const values = []
	
	db.all(query, values, function(error, users){
		if(error){
			callback("Database error.")
		}else{
			callback(null, users)
		}
	})
	
}

exports.getUserById = function(userId, callback){
	
	const query = "SELECT * FROM users WHERE id = ?"
	const values = [userId]
	
	db.get(query, values, function(error, user){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, user)
		}
		
	})
	
}


exports.getAccountByUsername = function(username , callback) {

	const query = "SELECT * FROM users WHERE name = ?"
	const values = [username]

	db.get(query, values, function(error, account){
		
		if(error){
			callback("Database error.")
		}else{
			callback([], account)
		}
	})

}

exports.createUser = function(name, email, password , picture ,callback){
	
	const query = "INSERT INTO users (name, email , password , picture) VALUES (?, ? , ? , ?)"
	const values = [name, email , password , picture]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, this.lastID)
		}
		
	})
	
}

