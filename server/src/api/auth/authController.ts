import { Request, Response } from 'express'

import { authService } from '@/api/auth/authService'
import { handleServiceResponse } from '@/common/utils/httpHandlers'

export const authController = {
	newVerification: async (req: Request, res: Response) => {
		const token = req.query.token as string

		const serviceResponse = await authService.newVerification(token)
		handleServiceResponse(serviceResponse, res)
	},
	enableTwoFactor: async (req: Request, res: Response) => {
		const user = res.locals.user

		const serviceResponse = await authService.enableTwoFactor(user)
		handleServiceResponse(serviceResponse, res)
	}
}
