import Joi from './joi'

export const objectId = Joi.object().keys({
	_id: Joi.string()
		.objectId()
		.label('Object ID')
})
