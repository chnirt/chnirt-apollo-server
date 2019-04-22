import Joi from 'joi'

const email = Joi.string()
	.email()
	.required()
	.label('Email')

const password = Joi.string()
	.min(8)
	.max(50)
	.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/)
	.required()
	.label('Password')
	.options({
		language: {
			string: {
				regex: {
					base:
						'must have at least one uppercase letter, on digit, and one special character.'
				}
			}
		}
	})

const username = Joi.string()
	.min(4)
	.max(30)
	.required()
	.label('Username')

export const signUp = Joi.object().keys({
	email,
	password,
	username
})

export const signIn = Joi.object().keys({
	email,
	password
})
