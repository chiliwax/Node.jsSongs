const express = require('express')
const bcrypt = require('bcrypt')

const db = require('./usersdb')
const playlists = require('./playlistsdb')
const songs = require("./songsdb")
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')


		
router.post("/login", function(request, response){
	
	const username = request.body.username
	const password = request.body.password

	db.getAccountByUsername(username, function(error, account) {
		if (0 < error.length) {
		response.status(500).end()
		} else if (!account) {
		response.status(400).json({
								  error: "Account does not exist"
								  })
		}  else {
			bcrypt.compare(password, account.password, function(err, res){
				
				if (res == false) {
						response.status(400).json({
							error: "Wrong username or password"
						})

				}

				else {
				const accessToken = jsonwebtoken.sign({
					accountId: account.id
					},
					"sdfjhdkjfhsdkjfhsk"
					)
					const idToken = jsonwebtoken.sign({
								sub: account.id,
								preferred_username: account.name
								},
								"sdfjhdkjfhsdkjfhsk"
							)
					response.status(200).json({
							access_token: accessToken,
							id_token: idToken,
							accountId: account.id
							})
						}			
			})
		}
		})
		

})
	
	
	




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



router.post("/create", function(request, response){
	
	const name = request.body.name
	const picture = request.body.picture
	const public = request.body.public
	const owner_id = request.body.owner_id
	
	const errors = getValidationErrors(name, picture)
	
	if(errors.length == 0){
		
		playlists.createPlaylist(name, picture , public , owner_id, function(error){
			if(error){
				response.status(500).json({error})
			}else{
                const model = {
                    name: name,
                    picture : picture ,
                    public : public ,
                    owner_id:owner_id
                }
				response.status(200).json({model})
			}
		})
		
	}else{
		
		
		
		response.status(400).json({errors})
		
	}
	
})




function getValidationErrors2(){
	
	const errors = []
	
	
	
	return errors
	
}



router.post("/addsong", function(request, response){
	
	const songID = request.body.songId
	const playlistID = request.body.playlistId
	
	
	const errors = getValidationErrors2()
	
	if(errors.length == 0){
		
		songs.addSongToPlaylist(playlistID , songID , function(error){
			if(error){
				response.status(500).json({error})
			}else{
                const model = {
                   playlistID: playlistID ,
                   songID : songID
                }
				response.status(200).json({model})
			}
		})
		
	}else{
		
		
		
		response.status(400).json({errors})
		
	}
	
})

module.exports = router;