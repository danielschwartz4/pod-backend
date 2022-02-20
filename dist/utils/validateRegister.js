"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "invalid username (cannot include @)",
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "username must be greater than 2 characters",
            },
        ];
    }
    if (options.password.length <= 2) {
        return [
            {
                field: "password",
                message: "password must be greater than 3 characters",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map