import dotenv from 'dotenv'
import { cleanEnv, host, num, port, str, url } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
	HOST: host(),
	PORT: port(),
	PUBLIC_URL: url(),
	CORS_ORIGIN: str(),
	COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
	COMMON_RATE_LIMIT_WINDOW_MS: num(),
	RESEND_API_KEY: str(),
	TWO_FACTOR_TOKEN_EXPIRES: num(),
	RESET_PASSWORD_TOKEN_EXPIRES: num(),
	VERIFICATION_TOKEN_EXPRIRES: num(),
	JWT_ACCESS_TOKEN_EXPIRATION_TIME: str(),
	JWT_REFRESH_TOKEN_EXPIRATION_TIME: str(),
	SALT: str(),
	SECRET: str()
})
