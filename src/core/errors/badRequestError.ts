import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './customApiError'

class BadRequestError extends CustomAPIError {
  statusCode: number
  errors?: {}

  constructor (message: string, errors?: {}) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
    this.errors = errors
  }
}

export default BadRequestError
