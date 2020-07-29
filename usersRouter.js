const express = require('express')
const users_db = require('./usersdb')
const playlists_db = require('./playlistsdb')
const songs_db = require('./songsdb')

const router = express.Router()



router.get("/", function(request, response){
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
	
	}else{
		users_db.getAllUsers(function(error, users){
			
			
				const model = {
					users: users
				}
				response.render("users.hbs", model)
			
		})
	}
})





router.get("/:id", function(request, response){
	
	const id = request.params.id
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
	
	}else{
		users_db.getUserById(id, function(error, user){
				owner_id = id
				playlists_db.getPlaylistsByOwnerId(id,function(error,playlists){
					songs_db.getSongsFromAllPlaylistPublic(id,function(error,songs){
						const model = {
							user:user ,
							playlists:playlists,
							songs:songs
						}
						
						response.render("user.hbs", model)
					})
				})		
		})
	}	
})


module.exports = router
