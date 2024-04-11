import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import { getToken } from '@/api/token/tokenService'
import { UserResponseSchemaType } from '@/api/user/userDto'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { db } from '@/common/utils/db'
import { env } from '@/common/utils/envConfig'
import {
	accessTokenPrivateKey,
	refreshTokenPrivateKey,
	TokenPayload
} from '@/common/utils/jwt'
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
	},
	enableTwoFactor: async (
		user: UserResponseSchemaType
	): Promise<ServiceResponse> => {
		try {
			const { email } = user

			await db.user.update({
				where: { email },
				data: { enabledTwoFactor: true }
			})

			return new ServiceResponse(
				'Success',
				'Enable Two Factor Authentication successfully',
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
	},
	generateTokenPair: (
		payload: TokenPayload
	): ServiceResponse<{ refreshToken: string; accessToken: string }> => {
		const accessToken = jwt.sign(payload, accessTokenPrivateKey, {
			algorithm: 'RS256',
			expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
		})

		const refreshToken = jwt.sign(payload, refreshTokenPrivateKey, {
			algorithm: 'RS256',
			expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
		})

		return new ServiceResponse(
			'Success',
			'Generate refresh token successfully',
			{ refreshToken, accessToken },
			StatusCodes.OK
		)
	}
}
