const express = require('express')
const bcrypt = require('bcrypt')

const db = require('./usersdb')
const playlists = require('./playlistsdb')
const songs = require("./songsdb")
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')

var secret = "sdfjhdkjfhsdkjfhsk"
var accToken , id_token , header_access , header_id

router.post("/login", function(request, response){
	
	const username = request.body.username
	const password = request.body.password

	db.getAccountByUsername(username, function(errors, account) {
		if (0 < errors.length) {
		response.status(500).end()
		} else if (!account) {
			response.status(400).json({errors: "Account does not exist"})
			} else {
				bcrypt.compare(password, account.password, function(err, res){
					
					if (res == false) {
							response.status(400).json({errors: "Wrong username or password"})
					} else {
					const accessToken = jsonwebtoken.sign({
						accountId: account.id
						},
						secret
					)
					const idToken = jsonwebtoken.sign({
						sub: account.id,
						preferred_username: account.name
						},
						secret
					)
					response.status(200).json({
						access_token: accessToken,
						accountId: account.id,
						token_type: "Bearer",
						id_token: idToken
						})

						// accToken = accessToken
						// account_id = account.id
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
	

	const errors = getValidationErrors(name, picture)
	
	if(errors.length == 0){
		try{

			// header_access = request.header('access_token')
			// if(!header_access) {throw response.status(400).json("Missing access token")}
			// if(!jsonwebtoken.verify(header_access, secret)) {throw response.status(400).json("Wrong access token")}

			const authorizationHeader = request.header("authorization") // "Bearer XXX"
			if (!authorizationHeader) { throw 'Token missing' }
			const accessToken = authorizationHeader.substring("Bearer ".length) // "XXX"
			if (!accessToken) { throw 'Invalid Token' }
			const payload = jwt.verify(accessToken, secret)
			if (!payload) { throw 'Invalid Token' }

			if( (jsonwebtoken.verify(header_access, secret)) ) {
					playlists.createPlaylist(name, picture , public , account_id, function(error){
						if(error){
							response.status(500).json({error})
							
						}else{
								const model = {
								name: name,
								picture : picture ,
								public : public 
							}
							response.status(200).json({model})	
							
						}
					})
			}
		}
	catch {
		response.status(400).json("Unpredicted error")
	}
		
	}else{
		response.status(400).json({errors})
		
	}
	
})





router.post("/addsong", function(request, response){
	
	const songID = request.body.songId
	const playlistID = request.body.playlistId
	
	

		try{

			header_access = request.header('access_token')

			if(!header_access) {throw response.status(400).json("Missing access token")}
			if(!jsonwebtoken.verify(header_access, secret)) {throw response.status(400).json("Wrong access token")}


			if( (jsonwebtoken.verify(header_access, secret)) ) {
			
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
			}
		}
		catch {
			response.status(400).json("Wrong access token")
		}

	
})

module.exports = router;