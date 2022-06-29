import express from "express"
import { updateUser, deleteUser, getUser, getAllUsers } from "../controllers/user.js"
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js"

const router = express.Router()

router.put("/", verifyUser, updateUser)

router.delete("/:id", verifyUser, deleteUser)

router.get("/:id", verifyUser, getUser)

router.get("/", verifyAdmin, getAllUsers)

export default router
