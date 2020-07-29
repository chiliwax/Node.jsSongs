const express = require('express')
const songs_db = require('./songsdb')
const playlists_db = require('./playlistsdb')

const router = express.Router()

function getValidationErrors(){
	
	const errors = []
	
	return errors
	
}


router.get("/", function(request, response){
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
		
	}else{
		songs_db.getAllSongs(function(error, songs){			
				playlists_db.getAllPlaylistsByOwnerId(request.session.account.id , function(error,playlists){		
				const model = {
					playlists : playlists ,
					songs: songs 				
				}
				response.render("songs.hbs", model)
				})		
		})
	}
	
})

router.post("/", function(request, response){
	
	const songID = request.body.songId
	const playlistID = request.body.playlistId
	const errors = getValidationErrors()
	
	// console.log(request.session.account.id)
	// console.log(request.signedCookies.user)
	// console.log(request.session.account.id == request.signedCookies.user.id)
	console.log(request.signedCookies.cookie1.id)
	if (request.session.account.id == request.signedCookies.cookie1.id && request.session.isLoggedIn) {
		if(errors.length == 0){
			
			songs_db.addSongToPlaylist(playlistID , songID , function(error){
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
	}
	else {
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
	}
})


module.exports = router