import crypto from 'crypto';

export async function hash(password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(8).toString("hex")

		crypto.scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			resolve(salt + ":" + derivedKey.toString('hex'))
		});
	})
}

export async function verify(password: string, hash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const [salt, key] = hash.split(":")
		crypto.scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			const keyBuffer = Buffer.from(key, 'hex')
			resolve(crypto.timingSafeEqual(keyBuffer, derivedKey))
		});
	})
}
