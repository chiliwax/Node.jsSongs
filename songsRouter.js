const express = require('express')
const db = require('./songsdb')
const db1 = require('./playlistsdb')

const router = express.Router()

// // Stardog

// 	const { Connection, query } = require('stardog');

// 	const conn = new Connection({

// 	username: 'admin',
// 	password: 'admin',
// 	endpoint: 'http://localhost:5820',

// 	});

// 	prefixes = "prefix dbr: <http://dbpedia.org/resource/> \
// 	prefix dbo: <http://dbpedia.org/ontology/> \
// 	prefix ns1: <http://purl.org/dc/terms/> \
// 	prefix foaf: <http://xmlns.com/foaf/0.1/>  "

// 	final_query = prefixes + " SELECT ?identifier ?name ?artist ?duration WHERE { \
// 		?song a dbo:Song. \
// 		?song dbr:Identifier ?identifier. \
// 		?song ns1:Creator ?artist. \
// 		?song foaf:name ?name. \
// 		?song dbo:duration ?duration \
// 	} \
// 	ORDER BY ASC(?identifier)"



// query.execute(conn, 'song_db', final_query, 'application/sparql-results+json', {

// 	limit: 5,
// 	offset: 0,

// 	}).then(({ body }) => {
// 	query_results = body.results.bindings
// 	// console.log(query_results)
// 	});


function getValidationErrors(){
	
	const errors = []
	
	
	
	return errors
	
}


router.get("/", function(request, response){
	
	db.getAllSongs(function(error, songs){
		
		if(!request.session.isLoggedIn){		
			response.send('Please login to view this page!');
			
		}else{
			db1.getAllPlaylistsByOwnerId(request.session.account.id , function(error,playlists){
					
			const model = {
				playlists : playlists ,
				songs: songs 				
			}
			response.render("songs.hbs", model)
			})
		}
		
	})
	
})

router.post("/", function(request, response){
	
	const songID = request.body.songId
	const playlistID = request.body.playlistId
	
	
	const errors = getValidationErrors()
	
	if(errors.length == 0){
		
		db.addSongToPlaylist(playlistID , songID , function(error){
			if(error){
				response.send(error);
			}else{
				response.redirect("/songs")
			}
		})
		
	}else{
		
		const model = {
			errors: errors
		}
		
		response.render("songs.hbs", model)
		
	}
	
})


module.exports = router