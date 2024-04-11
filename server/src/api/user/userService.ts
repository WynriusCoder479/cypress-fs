import argon2 from 'argon2'
import { StatusCodes } from 'http-status-codes'

import { authService } from '@/api/auth/authService'
import { mailService } from '@/api/mail/mailService'
import { generateToken, getToken } from '@/api/token/tokenService'
import {
	LoginSchema,
	LoginSchemaType,
	RegisterSchema,
	RegisterSchemaType,
	UserResponseSchema,
	UserResponseSchemaType
} from '@/api/user/userDto'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { db } from '@/common/utils/db'
import { logger } from '@/server'

export const userService = {
	register: async (
		registerInput: RegisterSchemaType
	): Promise<ServiceResponse<UserResponseSchemaType | null>> => {
		try {
			const validatedFields = RegisterSchema.safeParse(registerInput)

			if (!validatedFields.success)
				return new ServiceResponse(
					'Failed',
					'Invalid fields',
					null,
					StatusCodes.BAD_REQUEST
				)

			const { name, email, password } = validatedFields.data

			const existingUser = await db.user.findUnique({ where: { email } })

			if (existingUser)
				return new ServiceResponse(
					'Failed',
					'Email is already taken by another user',
					null,
					StatusCodes.BAD_REQUEST
				)

			const hashedPassword = await argon2.hash(password)

			const newUser = await db.user.create({
				data: {
					name,
					email,
					hashedPassword
				}
			})

			const verificationToken = await generateToken.verificationToken(
				newUser.email
			)

			if (verificationToken.status === 'Failed')
				return new ServiceResponse(
					'Failed',
					'Generate token failed',
					null,
					StatusCodes.BAD_REQUEST
				)

			if (verificationToken.data)
				await mailService.sendVeficationEmail(
					newUser.email,
					verificationToken.data.token
				)

			return new ServiceResponse(
				'Email-Sent',
				'Verification email sent',
				null,
				StatusCodes.OK
			)
		} catch (error) {
			logger.error(error)

			return new ServiceResponse(
				'Failed',
				'Internal Server Error',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	},
	login: async (
		loginSchema: LoginSchemaType
	): Promise<ServiceResponse<UserResponseSchemaType | null>> => {
		try {
			const validatedFields = LoginSchema.safeParse(loginSchema)

			if (!validatedFields.success)
				return new ServiceResponse(
					'Failed',
					'Invalid fileds',
					null,
					StatusCodes.BAD_REQUEST
				)

			const { email, password, code } = validatedFields.data

			const existingUser = await db.user.findUnique({
				where: { email }
			})

			if (!existingUser)
				return new ServiceResponse(
					'Failed',
					'Email or password is incorrect',
					null,
					StatusCodes.BAD_REQUEST
				)

			if (!existingUser.emailVerified) {
				const verificationToken = await generateToken.verificationToken(
					existingUser.email
				)

				if (verificationToken.status === 'Failed' || !verificationToken.data)
					return new ServiceResponse(
						'Failed',
						verificationToken.message,
						null,
						verificationToken.statusCode
					)

				await mailService.sendVeficationEmail(
					existingUser.email,
					verificationToken.data.token
				)

				return new ServiceResponse(
					'Email-Sent',
					'Visit your registed email to verify',
					null,
					StatusCodes.OK
				)
			}

			const verifiedPassword = await argon2.verify(
				existingUser.hashedPassword,
				password
			)

			if (!verifiedPassword)
				return new ServiceResponse(
					'Failed',
					'Email or password is incorrect',
					null,
					StatusCodes.BAD_REQUEST
				)

			if (existingUser.enabledTwoFactor) {
				if (!code) {
					const twoFactorToken = await generateToken.towFactorToken(
						existingUser.email
					)

					if (twoFactorToken.status === 'Failed' || !twoFactorToken.data)
						return new ServiceResponse(
							'Failed',
							twoFactorToken.message,
							null,
							twoFactorToken.statusCode
						)

					await mailService.twoFactorTokenEmail(
						existingUser.email,
						twoFactorToken.data.token
					)

					return new ServiceResponse(
						'Email-Sent',
						'Otp has sent your email',
						null,
						StatusCodes.OK
					)
				}

				const twoFactorTokenExisting =
					await getToken.twoFactorTokenByToken(code)

				if (twoFactorTokenExisting.status === 'Failed')
					return new ServiceResponse(
						'Failed',
						twoFactorTokenExisting.message,
						null,
						twoFactorTokenExisting.statusCode
					)

				const { accessToken, refreshToken } = authService.generateTokenPair({
					sub: existingUser.id,
					name: existingUser.name
				}).data

				await db.$transaction([
					db.user.update({
						where: { id: existingUser.id },
						data: { refreshToken }
					}),
					db.twoFactorToken.delete({
						where: { id: twoFactorTokenExisting.data?.id }
					})
				])

				const user = UserResponseSchema.parse(existingUser)

				user.token = accessToken

				return new ServiceResponse(
					'Success',
					'User login successfully',
					user,
					StatusCodes.OK
				)
			}

			const { accessToken, refreshToken } = authService.generateTokenPair({
				sub: existingUser.id,
				name: existingUser.name
			}).data

			await db.user.update({ where: { email }, data: { refreshToken } })

			const user = UserResponseSchema.parse(existingUser)

			user.token = accessToken

			return new ServiceResponse(
				'Success',
				'User login successfully',
				user,
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
	logout: async (email: string): Promise<ServiceResponse> => {
		try {
			const existingUser = await db.user.findUnique({ where: { email } })

			if (!existingUser)
				return new ServiceResponse(
					'Failed',
					'User not found',
					null,
					StatusCodes.NOT_FOUND
				)

			await db.user.update({
				where: { id: existingUser.id },
				data: { refreshToken: null }
			})

			return new ServiceResponse(
				'Success',
				'User logout successfully',
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
