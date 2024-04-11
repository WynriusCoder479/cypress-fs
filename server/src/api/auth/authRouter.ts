import express, { Router } from 'express'

import { authController } from '@/api/auth/authController'
import { auth } from '@/common/middleware/auth'

export const authRouter: Router = (() => {
	const router = express.Router()

	router.get('/new-verification', authController.newVerification)

	router.post('/enable-2fa', auth, authController.enableTwoFactor)

	return router
})()
