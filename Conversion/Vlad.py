
import csv
from rdflib.namespace import FOAF , DCTERMS
from rdflib import URIRef, Graph, Literal, RDF, Namespace


if __name__=='__main__':
	
	store = Graph()	
	
	# Bind a few prefix, namespace pairs for pretty output	
	n = Namespace("http://example.org/song/")
		
	dbo = Namespace("http://dbpedia.org/ontology/")

	dbr = Namespace("http://dbpedia.org/resource/")


	store.bind("", n)
	store.bind("dbo", dbo)
	store.bind("dbr",dbr)
	store.bind("foaf", FOAF)	
	
	#open the cvs file to read
	with open('./top50.csv', 'r') as csvfile:
		#go through the rows in csv file
		for column in (row.split("\t") for row in csvfile):
			# print(column)
			column = column[0].replace('\n', "").split(',')
			# print(column)
			song_id = column[0].replace('"',"")
			# print(song_id)
			song = URIRef(n +  song_id)
			store.add((song, RDF.type, dbo.Song))
			store.add((song , dbr.Identifier , Literal(column[0].replace('"',"")) )) ## Track ID
			store.add((song , FOAF.name , Literal(column[1].replace('"',"")) )) ## Track Name
			store.add((song , DCTERMS.Creator , Literal(column[2].replace('"',"")) )) ## The Artist who produced the track
			store.add((song , dbo.duration , Literal(column[10].replace('"',"")) )) ## Track length
				
	# Serialize as Turtle
	rdffile = open('Converted Top 50.ttl', 'wb')
	rdffile.write(store.serialize(format="turtle"))
		
	csvfile.close()
	rdffile.close()
