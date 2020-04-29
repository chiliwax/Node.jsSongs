const express = require('express')
const db = require('./usersdb')
const db1 = require('./playlistsdb')
const db2 = require('./songsdb')

const router = express.Router()



router.get("/", function(request, response){
	
	db.getAllUsers(function(error, users){
		
		if(!request.session.isLoggedIn){		
			response.send('Please login to view this page!');
		
		}else{
				
			const model = {
				users: users
			}
			response.render("users.hbs", model)
			
		}
		
	})
	
})





router.get("/:id", function(request, response){
	
	const id = request.params.id
	
	db.getUserById(id, function(error, user){
		
		if(!request.session.isLoggedIn){		
			response.send('Please login to view this page!');
		
		}else{
			owner_id = id
			db1.getPlaylistsByOwnerId(id,function(error,playlists){
				db2.getSongsFromAllPlaylistPublic(id,function(error,songs){
					const model = {
						user:user ,
						playlists:playlists,
						songs:songs
					}
					
					response.render("user.hbs", model)
				})
			})
			
			
		}
		
	})	
})


module.exports = router
