const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const db = require('./playlistsdb')
const db1 = require('./songsdb')


const songRouter = require('./songsRouter')
const userRouter = require('./usersRouter')
const playlistRouter = require('./playlistsRouter')
const register = require('./register')
const login = require('./login')

const apiRouter = require('./apiRouter')

const app = express()

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.use(
	express.static("public")
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))

app.use("/api", apiRouter)

app.use(
	express.static('views/images')
)

app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: "sdfjhdkjfhsdkjfhsk"
}))



app.use(function (request, response, next) {
	response.locals.isLoggedIn = request.session.isLoggedIn
	response.locals.account = request.session.account
	next()
})

app.use("/songs", songRouter)
app.use("/users", userRouter)
app.use("/home", playlistRouter)
app.use("/register", register)
app.use("/", login)

app.post("/logout", function (request, response) {
	request.session.isLoggedIn = false
	response.redirect("/")
})

app.get("/about", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.send('Please login to view this page!');

	} else
		response.render("about.hbs")
})


app.get("/contact", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.send('Please login to view this page!');

	} else
		response.render("contact.hbs", {})
})


app.get("/about1", function (request, response) {

	response.render("about.hbs", { layout: "intro.hbs" })
})

app.get("/contact1", function (request, response) {

	response.render("contact.hbs", { layout: "intro.hbs" })
})



app.get("/own_profile", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.send('Please login to view this page!');

	} else {
		db.getAllPlaylistsByOwnerId(request.session.account.id, function (error, playlists) {

			if (!request.session.isLoggedIn) {
				response.send('Please login to view this page!');
			}
			else {
				db1.getSongsFromAllPlaylist(request.session.account.id, function (error, songs) {
					const model = {
						playlists: playlists,
						songs: songs
					}
					response.render("own_profile.hbs", model)
				})
			}
		})
	}
})



const server = app.listen(8080, function () {
	var host = "localhost"
	var port = server.address().port;
	console.log('server running at http://' + host + ':' + port)
})