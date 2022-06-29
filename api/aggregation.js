import { MongoClient } from 'mongodb'
import dotenv from "dotenv"

dotenv.config()

const main = async () => {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(process.env.MONGO);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
	console.log("MongoDB connected")

        // Make the appropriate DB calls
	await printAvCheapCity(client)	

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
	console.log("MongoDB disconnected")
    }
}

main().catch(console.error);

// Add functions that make DB calls here

const printAvCheapCity = async (client) => {
	const pipeline = [
  		{
  		  '$match': {
  		    'distance': {
  		      '$gte': 800
  		    }
  		  }
  		}, {
  		  '$group': {
  		    '_id': '$city', 
  		    'average_price': {
  		      '$avg': '$cheapestPrice'
  		    }
  		  }
  		}, {
  		  '$sort': {
  		    'average_price': 1
  		  }
  		}, {
  		  '$limit': 5
  		}
	]

	const aggCursor = client.db("booking").collection("hotels").aggregate(pipeline)
	await aggCursor.forEach(hotels => {
		console.log(`${hotels._id} : ${hotels.average_price}`)
	})
}
