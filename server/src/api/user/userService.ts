import argon2 from 'argon2'
import { StatusCodes } from 'http-status-codes'

import { generateToken } from '@/api/token/tokenService'
import {
	RegisterSchema,
	RegisterSchemaType,
	UserResponseSchemaType
} from '@/api/user/userDto'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { db } from '@/common/utils/db'
import { sendMail } from '@/common/utils/mail'
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
				await sendMail.sendVeficationEmail(
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
	}
}
