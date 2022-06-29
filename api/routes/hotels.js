import express from "express"
import {createHotel, updateHotel, deleteHotel, getHotel, getAllHotels} from "../controllers/hotel.js"
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js"

const router = express.Router()

//CREATE: async is required because we will connect to the DB, then create on collection which will take time
router.post("/", verifyAdmin, createHotel)

//UPDATE
router.put("/:id", verifyAdmin, updateHotel)

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel)

//GET
router.get("/:id", getHotel)

//GET ALL
router.get("/", getAllHotels)

export default router
