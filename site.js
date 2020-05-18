const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const db = require('./playlistsdb')
const db1 = require('./songsdb')


const songRouter = require('./songsRouter')
const userRouter = require ('./usersRouter')
const playlistRouter = require('./playlistsRouter')
const register = require('./register')
const login = require('./login')

const apiRouter = require('./apiRouter')

const app = express()



app.engine("hbs" , expressHandlebars({
defaultLayout: "main.hbs"
}))

app.use(
    express.static("public")
)

app.use (
    express.static('views/images')
)

app.use(bodyParser.urlencoded({
	extended: false
}))

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

app.post("/logout", function(request, response){
	request.session.isLoggedIn = false
	response.redirect("/")
})

app.get("/about" , function(request , response) {
	if(!request.session.isLoggedIn){		
		response.send('Please login to view this page!');

	}else
    response.render("about.hbs" )
    })


app.get("/contact" , function(request , response) {
	if(!request.session.isLoggedIn){		
		response.send('Please login to view this page!');

	}else
    response.render("contact.hbs" ,{})
    })


app.get("/about1" , function(request , response) {
	
    response.render("about.hbs" ,{layout:"intro.hbs"})
    })

app.get("/contact1" , function(request , response) {
	
    response.render("contact.hbs" ,{layout:"intro.hbs"})
	})
	
app.get("/dog" , function(request , response) {	
	response.render("stardog.hbs" ,{})
	})
	
	

app.get("/own_profile" , function(request , response) {
	if(!request.session.isLoggedIn){		
		response.send('Please login to view this page!');

	} else
	
	db.getAllPlaylistsByOwnerId(request.session.account.id,function(error, playlists){
		
		if(!request.session.isLoggedIn){		
			response.send('Please login to view this page!');
		}
		else{
			db1.getSongsFromAllPlaylist(request.session.account.id,function(error, songs){
				const model = {
					playlists: playlists,
					songs:songs
				}
				response.render("own_profile.hbs", model)
			})
		}		
	})
	})

	

// Stardog Populate database

	const { Connection, query } = require('stardog');

	const conn = new Connection({

	username: 'admin',
	password: 'admin',
	endpoint: 'http://localhost:5820',

	});

	prefixes = "prefix dbr: <http://dbpedia.org/resource/> \
	prefix dbo: <http://dbpedia.org/ontology/> \
	prefix ns1: <http://purl.org/dc/terms/> \
	prefix foaf: <http://xmlns.com/foaf/0.1/>  "

	final_query = prefixes + " SELECT ?identifier ?name ?artist ?duration WHERE { \
		?song a dbo:Song. \
		?song dbr:Identifier ?identifier. \
		?song ns1:Creator ?artist. \
		?song foaf:name ?name. \
		?song dbo:duration ?duration \
	} \
	ORDER BY ASC(?identifier)"



// Actually populating the database
	query.execute(conn, 'song_db', final_query, 'application/sparql-results+json', {

	offset: 0,

	}).then(({ body }) => {

	// console.log(body.results.bindings);
	query_results = body.results.bindings

	for(i = 0; i < query_results.length; i++){
		var tablerow = query_results[i]
		// console.log(tablerow)
		// db1.populateStardogSongs(tablerow.name.value, tablerow.artist.value, tablerow.duration.value, i)
		
	}
	});








// Part 8 from teacher (doesn't work)


	
	var sparql_query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
	PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
	PREFIX dc: <http://purl.org/dc/elements/1.1/> \
	SELECT DISTINCT  ?songname ?artistname WHERE { \
	  ?song dc:title ?songname. \
	  ?song foaf:maker ?artist. \
	  ?artist foaf:name ?artistname \
	} \
	LIMIT 2000 '

// Part 8 from https://www.npmjs.com/package/sparql-http-client (It works!)
	
	const SparqlClient = require('sparql-http-client')
 
	const endpointUrl = 'http://dbtune.org/jamendo/sparql/'
	
	async function main () {
	  const client = new SparqlClient({ endpointUrl })
	  const stream = await client.query.select(sparql_query)
	 
	  var i = 0
	  var increment = 1
	  stream.on('data', row => {
		
		Object.entries(row).forEach(() => {
			
			if(i % 2 === 0) {

				
				db1.populateDbWithQueryResults(row.songname.value, row.artistname.value, increment)


				increment++
				i++
			} else{
				i++
			}
		})
	  })
	 
	  stream.on('error', err => {
		console.error(err)
	  })
	}
	 
	main()



app.listen(8081)