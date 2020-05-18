const sqlite = require('sqlite3')

const db = new sqlite.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS songs(
	id INTEGER PRIMARY KEY,
	name TEXT,
    artist TEXT ,
    length TEXT
)`)

// exports.getAllSongs = function(callback){
	
// 	const query = "SELECT * FROM songs ORDER BY id"
// 	const values = []
	
// 	db.all(query, values, function(error, songs){
// 		if(error){
// 			callback("Database error.")
// 		}else{
// 			callback(null, songs)
// 		}
// 	})
	
// }


exports.getAllSongs = function(callback){
// query.execute(conn, 'song_db', final_query, 'application/sparql-results+json', {

	
// 	offset: 0,

// 	}).then(({ body }) => {
// 	songs = body.results.bindings
// 	callback(null, songs)
// 	});

	const query = "SELECT * FROM songs ORDER BY id"
	const values = []

	db.all(query, values, function(error, songs){
		if(error){
			callback("Database error.")
		}else{
			callback(null, songs)
		}
	})
	
}


exports.populateStardogSongs = function(song, artist, time, introduced, callback) {
	const query = "SELECT * FROM songs ORDER BY id"
	const values = []

	db.all(query, values, function(error, songs){


		if(songs.length < introduced){
			db.run(`INSERT INTO songs(name, artist, length) VALUES(?, ?, ?)`, [song, artist, time], function (err) {
				if (err) {
				}
				 else{
	   
				 }
			   });
		}else{
		
		}
	})
}

	




exports.populateDbWithQueryResults = function(song, artist, introduced2,callback) {
	const query = "SELECT * FROM songs ORDER BY id"
	const values = []

	// console.log(introduced2)

	db.all(query, values, function(error, songs){


		if(songs.length < introduced2){
			
			db.run(`INSERT INTO songs(name, artist) VALUES(?, ?)`, [song, artist], function (err) {
				if (err) {
				}
				 else{
	   
				 }
			   });
		}else{
		}
	})
}







// exports.getSongsFromPlaylist = function(id, callback){
	
// 	const query1 = "select songID from refference where playlistID = ? "
// 	const values = [id]


// 	final_query = prefixes + " SELECT ?identifier ?name ?artist ?duration WHERE { \
// 		?song a dbo:Song. \
// 		?song dbr:Identifier ?identifier. \
// 		?song ns1:Creator ?artist. \
// 		?song foaf:name ?name. \
// 		?song dbo:duration ?duration. \
// 	} \
// 	ORDER BY ASC(?identifier)"

	
// 	db.all(query1, values, function(error, songs){
		
// 		if(error){
// 			callback("Database error.")
// 		}else{
			
// 		query.execute(conn, 'song_db', final_query, 'application/sparql-results+json', {

// 		offset: 0,
	
// 		}).then(({ body }) => {
// 		var i = 0
// 		contor = songs.length
// 		// console.log(contor >= 0)
// 		result = ""
// 		while (contor >= 0)
// 		{
// 			console.log(contor)
// 			if (body.results.bindings[i].identifier.value == songs[i]) {
// 				console.log(songs[i].value)
// 				result = result +  body.results.bindings[i]
// 				console.log(result)
// 			}
// 			i = i + 1
// 			contor = contor - 1
// 		}


// 		songs = result
// 		callback(null, songs)
// 		});
// 			// callback(null, songs)
// 		}
		
// 	})
// }




exports.getSongsFromPlaylist = function(id, callback){
	
	const query = "SELECT S.* FROM songs S INNER JOIN refference R on S.id = R.songID WHERE R.playlistID = ? "
	const values = [id]
	
	db.all(query, values, function(error, songs){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, songs)
		}
		
	})
}

exports.getSongsFromAllPlaylist = function(id, callback){
	
	const query = "SELECT S.* FROM songs S INNER JOIN refference R on S.id = R.songID INNER JOIN playlists P on P.id = R.playlistID AND P.owner_id = ?  "
	const values = [id]
	
	db.all(query, values, function(error, songs){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, songs)
		}
		
	})
}


exports.getSongsFromAllPlaylistPublic = function(id, callback){
	
	const query = "SELECT S.* FROM songs S INNER JOIN refference R on S.id = R.songID INNER JOIN playlists P on P.id = R.playlistID AND P.owner_id = ?  AND P.public = 1"
	const values = [id]
	
	db.all(query, values, function(error, songs){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, songs)
		}
		
	})
}


exports.addSongToPlaylist = function(playlistID, songID ,  callback){

	
	
	var query = "INSERT INTO refference (playlistID , songID) VALUES (?, ?);  "
	var values = [playlistID, songID ]
	
	
	db.run(query, values, function(error){
		
		if(error){
			if (error.errno === 19 ) {
				callback("Cannot have the same song 2 times in your playlist")
			}
			else {
				callback("Database Error")
			}
		}else{
			callback(null, this.lastID)
		}
		
	})
	
}

exports.deleteSongById = function(songID, playlistID, callback){
	
	const query = "DELETE FROM refference WHERE songID = ? AND playlistID = ?"
	const values = [songID , playlistID]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			// Can use this.changes to see how many rows that were deleted.
			callback(null)
		}
		
	})
	
}
