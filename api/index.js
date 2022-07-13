import express from "express"
//const express = require("express")

import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express()
dotenv.config()

//once this connection is etablished, it will automatically reconnect if it is interupted
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO)
	} catch (e) {
		handleError
		throw error
	}
}

mongoose.connection.on("disconnected", ()=>{
	console.log("MongoDB disconnected...")})
mongoose.connection.on("connected", ()=>{
	console.log("MongoDB connected!")
})

//middlewares : classic form => app.use(req, res, next)

//if proxy is not used, and it is more secured too
app.use(cors())

//cookies
app.use(cookieParser())

//json extension middleware
app.use(express.json())

//routes middlewares
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/hotels", hotelsRoute)
app.use("/api/rooms", roomsRoute)

//error handling middleware : it takes 4 parameters (classic middleware + error)
app.use((err, req, res, next) => {
	const errorStatus = err.status || 500
	const errorMessage = err.message || "Error handler"
	return res.status(errorStatus).json({
		success : false,
		status : errorStatus,
		message : errorMessage,
		stack: err.stack,
	})
})

//listen to a port and + etablish a connection on it through a call_back function 
app.listen(8800, ()=>{
	connect()
	console.log("Connected to backend!")
})
