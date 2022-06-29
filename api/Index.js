import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import http from "http"

const server = http.createServer((req, res) => {res.statusCode = 200})
dotenv.config()

const connect = async () => {
	const client = new MongoClient(process.env.MONGO)
	try {
		await client.connect()
		console.log("MongoDB is connected!")
		
		/*
		await create_doc(client, [
			{
			"name":"Hotel One",
			"type": "hotel",
    			"city": "Tana",
    			"address": "somewhere",
    			"distance": 500,
    			"title": "Sunset Hotel",
    			"desc": "description here",
    			"cheapestPrice": 100
			},

			{
			"name":"Hotel two",
			"type": "hotel",
    			"city": "Fianaratsoa",
    			"address": "somewhere",
    			"distance": 700,
    			"title": "Sunset Hotel",
    			"desc": "description here",
    			"cheapestPrice": 300
			},

			{
			"name":"Hotel three",
			"type": "hotel",
    			"city": "Mahanjunga",
    			"address": "somewhere",
    			"distance": 12000,
    			"title": "Sunset Hotel",
    			"desc": "description here",
    			"cheapestPrice": 500
			},
			{
			"name":"Hotel four",
			"type": "hotel",
    			"city": "Tamaga",
    			"address": "somewhere",
    			"distance": 3000,
    			"title": "Soup Hotel",
    			"desc": "description here",
    			"cheapestPrice": 400
			}, 
			{
			"name":"Hotel five",
			"type": "hotel",
    			"city": "Tulear",
    			"address": "somewhere",
    			"distance": 20000,
    			"title": "Hot Hotel",
    			"desc": "description here",
    			"cheapestPrice": 700
			},
		])
		*/

		//await read_doc(client, 'Hotel four')
		
		/*
		await read_specifics_docs(client, {
			min_distance : "1000",
			min_cheapestPrice : "500",
			maximumNumberOfResults : 5
		})
		*/

		//await update_doc(client, 'Hotel two', { city : "Fianaratsoa" })
		
		/*
		await upsert_doc(client, 'Hotel test',
			{
			"name":"Hotel ten",
			"type": "hotel",
    			"city": "Diego",
    			"address": "somewhere",
    			"distance": "17000",
    			"title": "North Hotel",
    			"desc": "description here",
    			"cheapestPrice": "800"
		})
		*/

		//await update_docs(client, {nbBed : {$exists : false}}, {nbBed : 'Unknwon'})
		
		//await delete_doc(client, {name: "Hotel ten"})
		
		//await delete_docs(client, {rating: {$gte : 6})

		await listDatabases(client)
	}
	catch(e) {
		console.error(e)
	}
	finally {
		await client.close() 
	}
}

// list/retrieve the collections in the database
const listDatabases = async (client) => {
	try {
		const databasesList = await client.db().admin().listDatabases()

		console.log("Databases:")
		databasesList.databases.forEach(db => {
			console.log(`- ${db.name}`)
		})
	} catch (e) {
		console.error(e)
	}
}

//CRUD mongoDB without mongoose and route: using the mongoDB collection's methods (insertOne(), insertMany(), findOne(), findMany(), updateOne(), updateMany(), deleteOne(), deleteMany()) 

//CREATE ONE OR MANY DOCUMENTS: insertOne(doc) and insertMany(array_of_doc)
const create_doc = async (client, newDoc) => {
	
	//create many documents
	if (newDoc.length > 1 ) {
	const result = await client.db("booking").collection("hotels").insertMany(newDoc)
	console.log(`${result.insertedCount} new hotels with ids:`)
	console.log(result.insertedIds)}
	
	//create one document
	else {
	const result = await client.db("booking").collection("hotels").insertOne(newDoc)
	console.log(`New hotel created with id: ${result.insertedId}`)
	}
}

//FIND/READ ONE DOCUMENT: findOne(query_object) such as query_object is a doc using query operations
const read_doc = async (client, elementDoc) => {
	const result = await client.db("booking").collection("hotels").findOne({name : elementDoc})
	if (result) {
		console.log(`Found the name : ${elementDoc}`)
	} else {
		console.log(`${elementDoc} not found`)
	}
}

//FIND/READ MULTIPLE DOCUMENTS WHICH CAN BE SPECIFICS: find(query_object)
const read_specifics_docs = async (client, {
	min_distance = 0,
	min_cheapestPrice = 0,
	maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) => {
	//sometimesm, a collection's method, which has a set of results, uses cursor to handle them
	//here, sort(), limit() and toArray() are cursor's methods
	const cursor = client.db("booking").collection("hotels").find({
		distance: { $gte: min_distance },
		cheapestPrice: { $gte: min_cheapestPrice },
	}).sort({ last_review: -1 })
	.limit(maximumNumberOfResults)

	const results = await cursor.toArray()

	if (results.length > 0) {
		console.log(`Found hotels with at least ${min_distance} meters and ${min_cheapestPrice} Ariary: `)
		results.forEach((result, i) => {
			//date = new Date(result.last_review).toDateString()	
			console.log()
			console.log(`${i + 1}.name: ${result.name}`)
			console.log(`	_id: ${result._id}`)
			console.log(`	Distance: ${result.distance}`)
			console.log(`	Price: ${result.cheapestPrice}`)})
	} else {
		console.log(`No hotels with ${min_distance} meters and ${min_cheapestPrice} Ariary`)
	}
}

//UPDATE ONE DOCUMENT: updateOne(filter, update_object) such as a filter is similar to query_object and update_object is a query_object but which use update operations (e.g: $inc, $currentDate, $set, $unset)
const update_doc = async (client, thename, updated_hotel) => {
	const result = await client.db("booking").collection("hotels").updateOne({name : thename}, {$set: updated_hotel})

	console.log(`${result.matchedCount} document(s) matched the query criteria`)
	console.log(`${result.modifiedCount} document(s) was/were updated`)
}
// with option (a 3rd argument) in updateOne(), it can be turn to upsert() which create the doc if it doesn't exist yet 
const upsert_doc = async (client, thename, updated_hotel) => {
	const result = await client.db("booking").collection("hotels").updateOne({name : thename}, {$set : updated_hotel}, {upsert : true})

	console.log(`${result.matchedCount} document(s) matched the query criteria.`);

	if (result.upsertedCount > 0) {
    	    console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    	} else {
    	    console.log(`${result.modifiedCount} document(s) was/were updated.`);
    	}
}

//UPDATE MANY DOCUMENTS: updateMany(filter, update_object)
const update_docs = async (client, props, updated_hotel) => {
	const result = await client.db("booking").collection("hotels").updateMany(props, { $set : updated_hotel})
	console.log(`${result.matchedCount} document(s) matched the query criteria`)
	console.log(`${result.modifiedCount} document(s) was/were updated`)
}

//DELETE ONE DOCUMENT: deleteOne(filter)
const delete_doc = async (client, filter) => {
	const result = await client.db("booking").collection("hotels").deleteOne(filter)
	console.log(`${result.deletedCount} document was deleted`)
}

//DELETE MANY DOCUMENTS: deleteMany(filter)
const delete_docs = async (client, filter) => {
	const result = await client.db("booking").collection("hotels").deleteMany(filter)
	console.log(`${result.deletedCount} document was deleted`)
}
server.listen(3000, '127.0.0.1', () => {
	connect()
	console.log('Connected to backend')
})
