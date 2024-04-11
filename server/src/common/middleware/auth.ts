import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { UserResponseSchema } from '@/api/user/userDto'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { db } from '@/common/utils/db'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { accessTokenPublicKey } from '@/common/utils/jwt'
import { logger } from '@/server'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	const authorizationHeader = req.headers.authorization

	if (!authorizationHeader || !authorizationHeader.startsWith('Bearer '))
		return handleServiceResponse(
			new ServiceResponse(
				'Failed',
				'Unauthorized: Missing or invalid Bearer token',
				null,
				StatusCodes.UNAUTHORIZED
			),
			res
		)

	const token = authorizationHeader.split(' ')[1]

	if (!token)
		return handleServiceResponse(
			new ServiceResponse(
				'Failed',
				'Invalid token',
				null,
				StatusCodes.UNAUTHORIZED
			),
			res
		)

	try {
		const decodedToken = jwt.verify(token, accessTokenPublicKey, {
			algorithms: ['RS256']
		}) as JwtPayload

		if (decodedToken.exp! <= Date.now() / 1000)
			handleServiceResponse(
				new ServiceResponse(
					'Failed',
					'Token has expires',
					null,
					StatusCodes.UNAUTHORIZED
				),
				res
			)

		const existingUser = await db.user.findUnique({
			where: { id: decodedToken.sub! }
		})

		if (!existingUser)
			handleServiceResponse(
				new ServiceResponse(
					'Failed',
					'User not found',
					null,
					StatusCodes.NOT_FOUND
				),
				res
			)

		const user = UserResponseSchema.parse(existingUser)

		res.locals.user = user
		next()
	} catch (error) {
		logger.error(error)

		handleServiceResponse(
			new ServiceResponse(
				'Failed',
				'Internal server error',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			),
			res
		)
	}
}
