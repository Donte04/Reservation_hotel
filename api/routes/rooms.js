import express from "express"
import {createRoom, updateRoom, deleteRoom, getRoom, getAllRooms} from "../controllers/room.js"
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js"

const router = express.Router()

//CREATE: async is required because we will connect to the DB, then create on collection which will take time
router.post("/:hotelid", verifyAdmin, createRoom)

//UPDATE
router.put("/:id", verifyAdmin, updateRoom)

//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom)

//GET
router.get("/:id", getRoom)

//GET ALL
router.get("/", getAllRooms)


export default router
