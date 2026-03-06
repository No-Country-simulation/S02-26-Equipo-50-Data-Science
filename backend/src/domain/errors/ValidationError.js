import DomainError from './DomainError.js';

class ValidationError extends DomainError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export default ValidationError;
