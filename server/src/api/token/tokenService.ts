import { randomUUID as uuidV4 } from 'node:crypto'

import {
	PasswordResetToken,
	TwoFactorToken,
	VerificationToken
} from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { generate as otpGenerate } from 'otp-generator'

import { ServiceResponse } from '@/common/models/serviceResponse'
import { db } from '@/common/utils/db'
import { env } from '@/common/utils/envConfig'
import { logger } from '@/server'

export const getToken = {
	twoFactorTokenByToken: async (
		token: string
	): Promise<ServiceResponse<TwoFactorToken | null>> => {
		try {
			const twoFactorToken = await db.twoFactorToken.findUnique({
				where: {
					token
				}
			})

			if (!twoFactorToken)
				return new ServiceResponse(
					'Failed',
					`Code is invalid`,
					null,
					StatusCodes.NOT_FOUND
				)
			const hasExpired = new Date(twoFactorToken.expires) < new Date()

			if (hasExpired) {
				await db.twoFactorToken.delete({ where: { token } })

				return new ServiceResponse(
					'Failed',
					'Code has expired',
					null,
					StatusCodes.FORBIDDEN
				)
			}

			return new ServiceResponse(
				'Success',
				'Get token successfully',
				twoFactorToken,
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
	verificationTokenByToken: async (
		token: string
	): Promise<ServiceResponse<VerificationToken | null>> => {
		try {
			if (!token)
				return new ServiceResponse(
					'Failed',
					'Token is invalid',
					null,
					StatusCodes.BAD_REQUEST
				)

			const verificationToken = await db.verificationToken.findUnique({
				where: {
					token
				}
			})

			if (!verificationToken)
				return new ServiceResponse(
					'Failed',
					`Token is invalid`,
					null,
					StatusCodes.NOT_FOUND
				)
			const hasExpired = new Date(verificationToken.expires) < new Date()

			if (hasExpired) {
				await db.passwordResetToken.delete({ where: { token } })

				return new ServiceResponse(
					'Failed',
					'Token has expired',
					null,
					StatusCodes.FORBIDDEN
				)
			}

			return new ServiceResponse(
				'Success',
				'Get token successfully',
				verificationToken,
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
	passwordResetTokenByToken: async (
		token: string
	): Promise<ServiceResponse<PasswordResetToken | null>> => {
		try {
			const passwordResetToken = await db.passwordResetToken.findUnique({
				where: {
					token
				}
			})

			if (!passwordResetToken)
				return new ServiceResponse(
					'Failed',
					`Code is invalid`,
					null,
					StatusCodes.NOT_FOUND
				)
			const hasExpired = new Date(passwordResetToken.expires) < new Date()

			if (hasExpired) {
				await db.passwordResetToken.delete({ where: { token } })

				return new ServiceResponse(
					'Failed',
					'Code has expired',
					null,
					StatusCodes.FORBIDDEN
				)
			}

			return new ServiceResponse(
				'Success',
				'Get token successfully',
				passwordResetToken,
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

export const generateToken = {
	towFactorToken: async (
		email: string
	): Promise<ServiceResponse<TwoFactorToken | null>> => {
		try {
			const existingToken = await db.twoFactorToken.findFirst({
				where: {
					email
				}
			})

			if (existingToken)
				await db.twoFactorToken.delete({
					where: {
						id: existingToken.id
					}
				})

			const token = otpGenerate(6, {
				digits: true,
				lowerCaseAlphabets: false,
				specialChars: false,
				upperCaseAlphabets: false
			})

			const expires = new Date(
				new Date().getTime() + env.TWO_FACTOR_TOKEN_EXPIRES
			)

			const newTwoFactorToken = await db.twoFactorToken.create({
				data: {
					email,
					expires,
					token
				}
			})

			return new ServiceResponse(
				'Success',
				'Create token successfully',
				newTwoFactorToken,
				StatusCodes.CREATED
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
	passwordResetToken: async (
		email: string
	): Promise<ServiceResponse<PasswordResetToken | null>> => {
		try {
			const existingToken = await db.passwordResetToken.findFirst({
				where: {
					email
				}
			})

			if (existingToken)
				await db.passwordResetToken.delete({ where: { id: existingToken.id } })

			const token = uuidV4()

			const expires = new Date(
				new Date().getTime() + env.TWO_FACTOR_TOKEN_EXPIRES
			)

			const newTwoFactorToken = await db.twoFactorToken.create({
				data: {
					email,
					expires,
					token
				}
			})

			return new ServiceResponse(
				'Success',
				'Create token successfully',
				newTwoFactorToken,
				StatusCodes.CREATED
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
	verificationToken: async (
		email: string
	): Promise<ServiceResponse<VerificationToken | null>> => {
		try {
			const existingToken = await db.verificationToken.findFirst({
				where: {
					email
				}
			})

			if (existingToken)
				await db.verificationToken.delete({
					where: {
						id: existingToken.id
					}
				})

			const token = uuidV4()

			const expires = new Date(
				new Date().getTime() + env.VERIFICATION_TOKEN_EXPRIRES
			)

			const newTwoFactorToken = await db.verificationToken.create({
				data: {
					email,
					expires,
					token
				}
			})

			return new ServiceResponse(
				'Success',
				'Create token successfully',
				newTwoFactorToken,
				StatusCodes.CREATED
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
