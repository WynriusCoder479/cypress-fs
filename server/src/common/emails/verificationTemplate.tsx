import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Text
} from '@react-email/components'
import React from 'react'

interface VerificationTemplateProps {
	href?: string
}

export const VerificationTemplate = ({ href }: VerificationTemplateProps) => (
	<Html>
		<Head />
		<Body style={main}>
			<Container style={container}>
				<Text style={tertiary}>Verification</Text>
				<Heading style={secondary}>
					Click &apos;Confirmation&apos; to vefiry your registered email.
				</Heading>
				<Button
					style={button}
					href={href}
				>
					Confirmation
				</Button>
			</Container>
			<Text style={footer}>Securely powered by Cypress.</Text>
		</Body>
	</Html>
)

export default VerificationTemplate

const main = {
	backgroundColor: '#ffffff',
	fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif'
}

const button = {
	backgroundColor: '#656ee8',
	borderRadius: '5px',
	color: '#fff',
	fontSize: '16px',
	fontWeight: 'bold',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	padding: '10px',
	marginTop: '14px'
}

const container = {
	backgroundColor: '#ffffff',
	border: '1px solid #eee',
	borderRadius: '5px',
	boxShadow: '0 5px 10px rgba(20,50,70,.2)',
	marginTop: '20px',
	maxWidth: '360px',
	margin: '0 auto',
	padding: '68px 1rem 130px'
}

const tertiary = {
	color: '#0a85ea',
	fontSize: '11px',
	fontWeight: 700,
	fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
	height: '16px',
	letterSpacing: '0',
	lineHeight: '16px',
	margin: '16px 8px 8px 8px',
	textTransform: 'uppercase' as const,
	textAlign: 'center' as const
}

const secondary = {
	color: '#000',
	display: 'inline-block',
	fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
	fontSize: '20px',
	fontWeight: 500,
	lineHeight: '24px',
	marginBottom: '0',
	marginTop: '0',
	textAlign: 'center' as const
}

const footer = {
	color: '#000',
	fontSize: '12px',
	fontWeight: 800,
	letterSpacing: '0',
	lineHeight: '23px',
	margin: '0',
	marginTop: '20px',
	fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
	textAlign: 'center' as const,
	textTransform: 'uppercase' as const
}
