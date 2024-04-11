import * as crypto from 'node:crypto'
import * as path from 'node:path'

import * as fs from 'fs'

export type TokenPayload = {
	sub: string
	name: string
}

const checkExistFolder = (name: string) => {
	const checkPath = path.join(__dirname, `../../../${name}`)

	!fs.existsSync(checkPath) && fs.mkdir(checkPath, err => err)
}

const securePath = '../../../secure'

const tokenPath = {
	accessTokenPrivate: path.join(
		__dirname,
		`${securePath}/access-token-private.key`
	),
	accessTokenPublic: path.join(
		__dirname,
		`${securePath}/access-token-public.key`
	),
	refreshTokenPrivate: path.join(
		__dirname,
		`${securePath}/refresh-token-private.key`
	),
	refreshTokenPublic: path.join(
		__dirname,
		`${securePath}/refresg-token-public.key`
	)
}

const checkExistingKeyPair = ({
	publicKeyPath,
	privateKeyPath
}: {
	publicKeyPath: string
	privateKeyPath: string
}): boolean => {
	const existedPublicKey = fs.existsSync(publicKeyPath)
	const existedPrivateKey = fs.existsSync(privateKeyPath)

	if (!existedPrivateKey || !existedPublicKey) return false

	return true
}

const getAccessTokenKeyPair = (): {
	accessTokenPrivateKey: string
	accessTokenPublicKey: string
} => {
	checkExistFolder('secure')

	//check existing key pair
	const existedKeyPair = checkExistingKeyPair({
		publicKeyPath: tokenPath.accessTokenPublic,
		privateKeyPath: tokenPath.accessTokenPrivate
	})

	if (!existedKeyPair) {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem'
			}
		})

		fs.writeFileSync(tokenPath.accessTokenPrivate, privateKey)
		fs.writeFileSync(tokenPath.accessTokenPublic, publicKey)
	}

	const accessTokenPrivateKey = fs.readFileSync(
		tokenPath.accessTokenPrivate,
		'utf-8'
	)
	const accessTokenPublicKey = fs.readFileSync(
		tokenPath.accessTokenPublic,
		'utf-8'
	)

	return { accessTokenPrivateKey, accessTokenPublicKey }
}

const getRefreshTokenKeyPair = (): {
	refreshTokenPrivateKey: string
	refreshTokenPublicKey: string
} => {
	checkExistFolder('secure')

	//check existing key pair
	const existedKeyPair = checkExistingKeyPair({
		publicKeyPath: tokenPath.refreshTokenPublic,
		privateKeyPath: tokenPath.refreshTokenPrivate
	})

	if (!existedKeyPair) {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem'
			}
		})

		fs.writeFileSync(tokenPath.refreshTokenPrivate, privateKey)
		fs.writeFileSync(tokenPath.refreshTokenPublic, publicKey)
	}

	const refreshTokenPrivateKey = fs.readFileSync(
		tokenPath.refreshTokenPrivate,
		'utf-8'
	)
	const refreshTokenPublicKey = fs.readFileSync(
		tokenPath.refreshTokenPublic,
		'utf-8'
	)

	return { refreshTokenPrivateKey, refreshTokenPublicKey }
}

export const { accessTokenPrivateKey, accessTokenPublicKey } =
	getAccessTokenKeyPair()
export const { refreshTokenPrivateKey, refreshTokenPublicKey } =
	getRefreshTokenKeyPair()
