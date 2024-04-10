import express, { Router } from 'express'

import { userService } from '@/api/user/userService'
import { handleServiceResponse } from '@/common/utils/httpHandlers'

export const userRouter: Router = (() => {
	const router = express.Router()

	router.post('/register', async (req, res) => {
		const serviceResponse = await userService.register(req.body)

		handleServiceResponse(serviceResponse, res)
	})

	return router
})()
