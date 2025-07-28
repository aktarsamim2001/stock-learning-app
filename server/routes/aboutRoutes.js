import express from 'express'
import { getAbout, updateAbout } from '../controllers/aboutController.js'
import { roleCheckMiddleware } from '../middleware/roleCheckMiddleware.js'

const router = express.Router()

// Public: Get about content
router.get('/', getAbout)

// Admin: Update about content
router.put('/', roleCheckMiddleware(['admin']), updateAbout)

export default router
