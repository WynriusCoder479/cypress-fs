import express, { Router } from 'express'

import { authService } from '@/api/auth/authService'
import { handleServiceResponse } from '@/common/utils/httpHandlers'

export const authRouter: Router = (() => {
	const router = express.Router()

	router.get('/new-verification', async (req, res) => {
		const token = req.query.token as string

		const serviceResponse = await authService.newVerification(token)
		handleServiceResponse(serviceResponse, res)
	})

	return router
})()
