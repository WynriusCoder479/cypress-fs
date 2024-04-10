import { z } from 'zod'

export const UserResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	avatar: z.string(),
	emailVerified: z.string().datetime(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime()
})

export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>

export const RegisterSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Email is required' }),
	password: z.string().min(1, { message: 'Password is required' })
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>
