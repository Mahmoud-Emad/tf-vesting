import type { InputValidationsType } from './types';
import { StrKey } from 'stellar-sdk';

export const validateAddress = (value: string): InputValidationsType => {
  if (value === '') {
    return {
      isValid: false,
      errorMessage: 'Address is required!',
    };
  }
  if (!StrKey.isValidEd25519PublicKey(value)) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid address.',
    };
  } else {
    return {
      isValid: true,
      errorMessage: '',
    };
  }
};
