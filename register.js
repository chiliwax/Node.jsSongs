const express = require('express')
const db = require('./usersdb')
const bcrypt = require('bcrypt')
const router = express.Router()


function getValidationErrors(name, email , password , pass2 , picture){
	
	const errors = []
	
	if(name.length == 0){
		errors.push("Name may not be empty.")
	}
	
	if(email.length == 0){
		errors.push("Must enter an email.")
	}

	if(password.length == 0){
		errors.push("Must enter a password.")
	}

	if(pass2.length == 0){
		errors.push("Please confirm password.")
	}

	if(pass2 != password){
		errors.push("Passwords don't match.")
    }
    
    if(picture.length == 0) {
        errors.push("You need to enter a profile picture")
    }
	
	return errors
	
}


router.get("/" , function(request,response) {
    response.render("register.hbs", {layout :'intro.hbs'})
})



router.post("/", function(request, response){
	
	const name = request.body.name
    const email = request.body.email
    const password = request.body.password
    const pass2 = request.body.pass2
    const picture = request.body.picture

	
	const errors = getValidationErrors(name, email, password , pass2 , picture)
	
	if(errors.length == 0){
		
		bcrypt.hash(request.body.password , 10 , function(err,hash) {

		db.createUser(name, email, hash ,picture , function(error){
			if(error){
				// TODO: Handle error.
			}else{
				response.redirect("/")
			}
		})
	})

	} else {
		
		const model = {
			errors: errors,
			name: name,
            email: email ,
            password: password ,
            picture: picture , 
            layout : "intro.hbs"
		}
		response.render("register.hbs", model)
	}
	
})

module.exports = router
