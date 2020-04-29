const sqlite = require('sqlite3')

const db = new sqlite.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS playlists(
    id INTEGER PRIMARY KEY,
    owner_id INTEGER ,
    picture TEXT,
	name TEXT ,
	public BOOLEAN ,
    FOREIGN KEY(owner_id) REFERENCES users(id)
)`)


exports.getAllPlaylists = function(callback){
	
	const query = "SELECT * FROM playlists WHERE public = 1 ORDER BY id"
	const values = []
	
	db.all(query, values, function(error, playlists){
		if(error){
			callback("Database error.")
		}else{
			callback(null, playlists)
		}
	})
	
}



exports.createPlaylist = function(name, picture, public, owner_id, callback){

	if (public == "on") {
		public = 1
	}
	else {
		public = 0
	}
	
	var query = "INSERT INTO playlists (name, picture , public,owner_id) VALUES (?, ? , ? ,?);  "
	var values = [name, picture , public , owner_id ]
	
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, this.lastID)
		}
		
	})	
}



exports.getPlaylistById = function(playlistId, callback){
	
	const query = "SELECT * FROM playlists WHERE id = ?"
	const values = [playlistId]
	
	db.get(query, values, function(error, playlist){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, playlist)
		}
		
	})
}

exports.getPlaylistsByOwnerId = function(id, callback){
	
	const query = "SELECT * FROM playlists WHERE owner_id = ? and public = 1"
	const values = [id]
	
	db.all(query, values, function(error, playlists){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, playlists)
		}
		
	})
}

exports.getAllPlaylistsByOwnerId = function(id, callback){
	
	const query = "SELECT * FROM playlists WHERE owner_id = ?"
	const values = [id]
	
	db.all(query, values, function(error, playlists){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, playlists)
		}
		
	})
}


exports.deletePlaylistById = function(playlistId, callback){
	
	var query = "DELETE FROM playlists WHERE id = ?"
	const values = [playlistId]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null)
		}
		
	})
	var query = "DELETE FROM refference WHERE playlistID = ?"
	db.run(query, values, function(error){})
	
}
