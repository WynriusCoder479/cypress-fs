import express, { Router } from 'express'

import { userController } from '@/api/user/userController'

export const userRouter: Router = (() => {
	const router = express.Router()

	router.post('/register', userController.register)

	router.post('/login', userController.login)

	router.put('/logout', userController.logout)

	return router
})()
