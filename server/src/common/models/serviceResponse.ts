import { z } from 'zod'

export class ServiceResponse<T = null> {
	status: 'Success' | 'Failed' | 'Email-Sent'
	message: string
	data: T
	statusCode: number

	constructor(
		status: 'Success' | 'Failed' | 'Email-Sent',
		message: string,
		data: T,
		statusCode: number
	) {
		this.status = status
		this.message = message
		this.data = data
		this.statusCode = statusCode
	}
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		status: z.string(),
		message: z.string(),
		data: dataSchema.optional(),
		statusCode: z.number()
	})
