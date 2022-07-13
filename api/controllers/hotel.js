import Hotel from "../models/Hotel.js"
import {createError} from "../utils/error.js"

export const createHotel = async (req, res, next) => {
	const newHotel = new Hotel(req.body)

	try {
		const savedHotel = await newHotel.save()
		res.status(200).json(savedHotel)
	}
	catch(e) {
		next(createError(e.status, e.message))
	}
}

export const updateHotel = async (req, res, next) => {
	try {
		const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new : true }) // to update, use mongoDB set method
		res.status(200).json(updatedHotel)
	} catch (e) {
		next(createError(e.status, e.message))
	}
}

export const deleteHotel = async (req, res, next) => {
	try {
		await Hotel.findByIdAndDelete(req.params.id)
		res.status(200).json("Hotel has been deleted")
	} catch (e) {
		next(createError(e.status, e.message))
	}
}

export const getHotel = async (req, res, next) => {
	try {
		const hotel = await Hotel.findById(req.params.id)
		res.status(200).json(hotel)
	} catch (e) {
		next(createError(e.status, e.message))
	}
}

export const getAllHotels = async (req, res, next) => {
	const { min, max, ...others } = req.query
	try {
		const hotels = await Hotel.find({
			...others, 
			cheapestPrice : {$gt: min || 1, $lt: max || 999}}).
			limit(req.query.limit)
		res.status(200).json(hotels)
	} catch (e) {
		next(createError(e.status, e.message))
	}
}

export const countByCity = async (req, res, next) => {

	const cities =  req.query.cities.split(",")

	try {
		const list = await Promise.all(cities.map(city=>{
			//return Hotel.find({city:city}).length //the query operation is not optimal
			return Hotel.countDocuments({city:city}) //same result without fetching properties, it is more faster (countDocuments is a mongoDB method)
		}))
		res.status(200).json(list)
	} catch (e) {
		next(createError(e.status, e.message))
	}
}

export const countByType = async (req, res, next) => {
	try {
		const hotelCount = await Hotel.countDocuments({type:"hotel"})
		const apartmentCount = await Hotel.countDocuments({type:"apartment"})
		const resortCount = await Hotel.countDocuments({type:"resort"})
		const villaCount = await Hotel.countDocuments({type:"villa"})
		const cabinCount = await Hotel.countDocuments({type:"cabin"})
		
		res.status(200).json([
			{ type: "hotel", count: hotelCount },
			{ type: "apartments", count: apartmentCount },
			{ type: "resorts", count: resortCount },
			{ type: "villas", count: villaCount },
			{ type: "cabins", count: cabinCount },
		])
	} catch (e) {
		next(createError(e.status, e.message))
	}
}

