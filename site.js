const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const playlists_db = require('./playlistsdb')
const songs_db = require('./songsdb')
var cookieParser = require('cookie-parser')


const songRouter = require('./songsRouter')
const userRouter = require ('./usersRouter')
const playlistRouter = require('./playlistsRouter')
const register = require('./register')
const login = require('./login')

const apiRouter = require('./apiRouter')

const app = express()


app.use(cookieParser('my secret'))


app.engine("hbs" , expressHandlebars({
defaultLayout: "main.hbs"
}))

app.use(express.static("public"))

app.use (express.static('views/images'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: "sdfjhdkjfhsdkjfhsk"
}))

app.use("/api", apiRouter)

app.use(function(request, response, next){
	response.locals.isLoggedIn = request.session.isLoggedIn
	response.locals.account = request.session.account
	next()
})

app.use("/songs", songRouter)
app.use("/users" , userRouter)
app.use("/home" , playlistRouter)
app.use("/register" , register)
app.use("/" , login)

app.post("/sign_up", function(request, response){
	response.redirect("/register")
})




app.post("/logout", function(request, response){
	request.session.isLoggedIn = false
	response.clearCookie("cookie1")
	response.redirect("/")
})

app.get("/about" , function(request , response) {
	if(!request.session.isLoggedIn){		
		response.send('Please login to view this page!');
	} else
    response.render("about.hbs" )
})


app.get("/contact" , function(request , response) {
	if(!request.session.isLoggedIn){		
		response.send('Please login to view this page!');
	} else
    response.render("contact.hbs" ,{})
})


app.get("/about1" , function(request , response) {
    response.render("about.hbs" ,{layout:"intro.hbs"})
})

app.get("/contact1" , function(request , response) {
    response.render("contact.hbs" ,{layout:"intro.hbs"})
})
		
	

app.get("/own_profile" , function(request , response) {
	if(!request.session.isLoggedIn){		
		response.render("not_loggedin.hbs", {layout:"intro.hbs"})
	} else {
		playlists_db.getAllPlaylistsByOwnerId(request.session.account.id,function(error, playlists){
			
				songs_db.getSongsFromAllPlaylist(request.session.account.id,function(error, songs){
					const model = {
						playlists: playlists,
						songs:songs
					}
					response.render("own_profile.hbs", model)
				})	
		})
	}
})

	


app.listen(8080)