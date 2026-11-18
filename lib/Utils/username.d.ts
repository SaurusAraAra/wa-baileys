declare const USERNAME_MIN_LENGTH = 3;
declare const USERNAME_MAX_LENGTH = 35;
declare const USERNAME_PIN_LENGTH = 4;
declare const UsernameValidationError: {
    INVALID_CHARACTER: string;
    INVALID_LENGTH: string;
    INVALID_NO_LETTERS: string;
    INVALID_PERIODS: string;
    INVALID_DOMAIN_SUFFIX: string;
    INVALID_WWW_PREFIX: string;
    INVALID_WORD: string;
};
declare const stripUsernamePrefix: (username: any) => any;
declare const displayUsername: (username: any) => string;
declare const validateUsername: (username: any) => {
    isValid: boolean;
    errorType: string;
} | {
    errorType?: undefined;
    isValid: boolean;
};
declare const isUsernamePin: (pin: any) => boolean;
export { USERNAME_MIN_LENGTH };
export { USERNAME_MAX_LENGTH };
export { USERNAME_PIN_LENGTH };
export { UsernameValidationError };
export { stripUsernamePrefix };
export { displayUsername };
export { validateUsername };
export { isUsernamePin };
