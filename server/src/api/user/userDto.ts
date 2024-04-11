import { z } from 'zod'

export const UserResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	avatar: z.string().nullish(),
	emailVerified: z.coerce.date(),
	token: z.string().nullish(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
})

export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>

export const RegisterSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Email is required' }),
	password: z.string().min(1, { message: 'Password is required' })
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
	email: z.string().email({ message: 'Email is required' }),
	password: z
		.string()
		.min(6, { message: 'Password must have at least 6 character' }),
	code: z.optional(z.string())
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
