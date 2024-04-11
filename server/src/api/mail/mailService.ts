import { Resend } from 'resend'

import ResetPasswordTempalate from '@/common/emails/resetPasswordTemplate'
import TwoFactorCodeTemplate from '@/common/emails/twoFactorCodeTemplate'
import VerificationTemplate from '@/common/emails/verificationTemplate'
import { env } from '@/common/utils/envConfig'

const resend = new Resend(env.RESEND_API_KEY)

const domain = env.PUBLIC_URL

export const mailService = {
	twoFactorTokenEmail: async (email: string, token: string) => {
		await resend.emails.send({
			from: 'Cypress <crepress-mail@resend.dev>',
			to: email,
			subject: '2FA Code',
			react: TwoFactorCodeTemplate({ token })
		})
	},
	sendPasswordResetEmail: async (email: string, token: string) => {
		const resetLink = `${domain}/auth/new-password?token=${token}`

		await resend.emails.send({
			from: 'Cypress <cypress-mail@resend.dev>',
			to: email,
			subject: 'Reset your password',
			react: ResetPasswordTempalate({ href: resetLink })
		})
	},
	sendVeficationEmail: async (email: string, token: string) => {
		const confirmLink = `${domain}/auth/new-verification?token=${token}`

		await resend.emails.send({
			from: 'Cypress <cypress-mail@resend.dev>',
			to: email,
			subject: 'Confirm your email',
			react: VerificationTemplate({ href: confirmLink })
		})
	}
}
