const express = require('express')
const playlists_db = require('./playlistsdb')
const songs_db = require("./songsdb")
const { request } = require('express')

const router = express.Router()

function getValidationErrors(name, picture){
	
	const errors = []
	
	if(name.length == 0){
		errors.push("Name may not be empty.")
	}
	
	if(picture.length == 0){
		errors.push("Must enter a picture.")
	}

	return errors
	
}






router.get("/", function(request, response){
	
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
	}
	else{
		playlists_db.getAllPlaylists(function(error, playlists){			
			const model = {
				playlists: playlists
			}
			response.render("home.hbs", model)			
		})
	}
	
})




router.get("/create", function(request, response){
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
	} else {
		response.render("create_playlist.hbs")
	}
	// console.log(request.signedCookies.user)

})



router.post("/create", function(request, response){
	
	const name = request.body.name
	const picture = request.body.picture
	const public = request.body.public
	const owner_id = request.body.owner_id
	
	const errors = getValidationErrors(name, picture)
	// console.log(request.body.owner_id != request.signedCookies.user.id)
	if(owner_id != request.signedCookies.user.id && request.session.isLoggedIn){	//or this one : if(owner_id != request.session.account.id)	
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})

	} else {
		if(errors.length == 0){
			
			playlists_db.createPlaylist(name, picture , public , owner_id, function(error){
				if(error){
					// TODO: Handle error.
				} else {
					response.redirect("/home")
				}
			})
			
		} else {
			const model = {
				errors: errors,
				name: name,
				picture : picture ,
				public : public ,
				owner_id:owner_id
			}
			response.render("create_playlist.hbs", model)
		}
	}
	
})

router.get("/:id", function(request, response){
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})

	} else {

	const id = request.params.id
	
	playlists_db.getPlaylistById(id, function(error, playlist){
		
		if(error){
			// TODO: Handle error.
		}else
			{
				songs_db.getSongsFromPlaylist(id ,function(error,songs){
					const model = {
						playlist:playlist,
						songs: songs
					}
					response.render("playlist.hbs", model)

				})
			}
		})	
	}
})


router.post("/delsong", function(request, response){
	
	const songID = request.body.songID
	const playlistID = request.body.playlistID
	var owner = request.body.ownerID

	// console.log(request.body.ownerID)

	if(owner != request.signedCookies.user.id && request.session.isLoggedIn){		//or this one : if(owner != request.session.account.id)
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})

	} else {
		songs_db.deleteSongById(songID, playlistID ,function(error){
			
			if(error){
				// TODO: Handle error.
			} else {
				playlists_db.getPlaylistById(playlistID, function(error, playlist){	
					songs_db.getSongsFromPlaylist(playlistID ,function(error,songs){
						const model = {
								playlist:playlist,
								songs: songs
							}
						response.render("playlist.hbs", model)
					})
				})	
			}
			
		})
	}
	
})



router.post("/:id", function(request, response){
	
	var owner = request.body.ownerID	

	const id = request.params.id
	if(owner != request.signedCookies.user.id && request.session.isLoggedIn){	//or this one : if(owner != request.session.account.id)	
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})

	} else {
		playlists_db.deletePlaylistById(id, function(error){
			if(error){
				// TODO: Handle error.
			} else {
				response.redirect("/home")
			}
		})
	}
	
})



module.exports = router