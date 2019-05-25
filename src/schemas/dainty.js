import Joi from 'joi'

const imageUrl = Joi.string()
	.min(1)
	.max(500)
	.required()
	.label('imageUrl')

const name = Joi.string()
	.min(1)
	.max(50)
	.required()
	.label('Name')

const quantity = Joi.number()
	.min(1)
	.max(50)
	.required()
	.label('Quantity')

export const createDainty = Joi.object().keys({
	imageUrl,
	name,
	quantity
})
