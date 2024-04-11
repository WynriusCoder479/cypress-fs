import { Request, Response } from 'express'

import { userService } from '@/api/user/userService'
import { handleServiceResponse } from '@/common/utils/httpHandlers'

export const userController = {
	register: async (req: Request, res: Response) => {
		const serviceResponse = await userService.register(req.body)

		handleServiceResponse(serviceResponse, res)
	},
	login: async (req: Request, res: Response) => {
		const serviceResponse = await userService.login(req.body)

		handleServiceResponse(serviceResponse, res)
	},
	logout: async (req: Request, res: Response) => {
		const serviceResponse = await userService.logout(req.body.email)

		handleServiceResponse(serviceResponse, res)
	}
}
