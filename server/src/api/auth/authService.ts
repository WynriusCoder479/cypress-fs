import { StatusCodes } from 'http-status-codes'

import { getToken } from '@/api/token/tokenService'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { db } from '@/common/utils/db'
import { logger } from '@/server'

export const authService = {
	newVerification: async (token: string): Promise<ServiceResponse> => {
		try {
			const existingToken = await getToken.verificationTokenByToken(token)

			if (existingToken.status === 'Failed')
				return new ServiceResponse(
					'Failed',
					existingToken.message,
					null,
					StatusCodes.BAD_REQUEST
				)

			if (existingToken.data) {
				await db.$transaction([
					db.user.update({
						where: { email: existingToken.data.email },
						data: { emailVerified: new Date() }
					}),
					db.verificationToken.delete({
						where: {
							id: existingToken.data.id
						}
					})
				])
			}

			return new ServiceResponse(
				'Success',
				'Your email is verified',
				null,
				StatusCodes.OK
			)
		} catch (error) {
			logger.error(error)

			return new ServiceResponse(
				'Failed',
				'Internal server error',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	}
}
