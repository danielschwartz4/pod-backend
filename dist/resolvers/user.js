"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
const types_1 = require("../types/types");
const validateRegister_1 = require("../utils/validateRegister");
const UsernamePasswordInput_1 = require("../types/UsernamePasswordInput");
const uuid_1 = require("uuid");
const sendEmail_1 = require("../utils/sendEmail");
const graphql_type_json_1 = require("graphql-type-json");
let UserResolver = class UserResolver {
    async me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await User_1.User.findOne({ id: req.session.userId });
        return user;
    }
    async podUsers(ids) {
        const users = await User_1.User.find({ where: { id: (0, typeorm_1.In)(ids) } });
        return users;
    }
    async sendEmails(userIds, message, subject) {
        if (!userIds) {
            return "no emails provided";
        }
        else {
            let emails = [];
            userIds.forEach(async (id) => {
                let user = await User_1.User.findOne({ id: id });
                if (user === null || user === void 0 ? void 0 : user.email) {
                    emails.push(user === null || user === void 0 ? void 0 : user.email);
                }
            });
            emails.forEach((email) => {
                (0, sendEmail_1.sendEmail)(email, message, subject);
            });
        }
        return "success";
    }
    async register(options, { req }) {
        const errors = (0, validateRegister_1.validateRegister)(options);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const avatar = Math.floor(Math.random() * 4) + 1;
        let user;
        try {
            user = await User_1.User.create({
                username: options.username,
                email: options.email,
                password: hashedPassword,
                feedback: options.feedback,
                avatar: avatar,
            }).save();
        }
        catch (err) {
            console.log("Error:", err.message);
        }
        req.session.userId = user === null || user === void 0 ? void 0 : user.id;
        return { user };
    }
    async login(email, password, { req }) {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "that email doesn't exist",
                    },
                ],
            };
        }
        const validPassword = await argon2_1.default.verify(user.password, password);
        if (!validPassword) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return { user };
    }
    async forgotPassword(email, { redis }) {
        console.log(email);
        const user = await User_1.User.findOne({ where: { email } });
        console.log(email);
        if (!user) {
            return true;
        }
        const token = (0, uuid_1.v4)();
        await redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3);
        await (0, sendEmail_1.sendEmail)(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`, "password change");
        return true;
    }
    async changePassword(token, newPassword, { redis, req }) {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "password must be greater than 2 characters",
                    },
                ],
            };
        }
        const key = constants_1.FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    },
                ],
            };
        }
        const userIdNum = parseInt(userId);
        const user = await User_1.User.findOne(userIdNum);
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }
        User_1.User.update({ id: userIdNum }, { password: await argon2_1.default.hash(newPassword) });
        await redis.del(key);
        req.session.userId = user.id;
        return { user };
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    async updatePhone(id, phone) {
        const user = await User_1.User.findOne(id);
        if (!user) {
            console.log("phone number already being used");
            return { errors: "phone number already being used" };
        }
        const newPhone = phone.split("-").join("");
        console.log("NEW PHONEEE");
        console.log(newPhone);
        await User_1.User.update({ id }, { phone: newPhone });
        return { user };
    }
    async updateUserFriendRequests(username, projectId, podId, isAdding) {
        const user = await User_1.User.findOne({ where: { username } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "user does not exist",
                    },
                ],
            };
        }
        let newRequests = [];
        if (isAdding) {
            if (user.friendRequests === null) {
                newRequests = [{ projectId: projectId, podId: podId }];
            }
            else {
                newRequests = user.friendRequests;
                if (newRequests === null || newRequests === void 0 ? void 0 : newRequests.find((request) => request.projectId === projectId)) {
                    return {
                        errors: [
                            {
                                field: "user",
                                message: "friend request already sent",
                            },
                        ],
                    };
                }
                else {
                    newRequests === null || newRequests === void 0 ? void 0 : newRequests.push({ projectId: projectId, podId: podId });
                }
            }
        }
        else {
            if (user.friendRequests === null) {
                return {
                    errors: [
                        {
                            field: "user",
                            message: "no friend requests",
                        },
                    ],
                };
            }
            else {
                newRequests = user.friendRequests;
                if (!(newRequests === null || newRequests === void 0 ? void 0 : newRequests.find((request) => request.projectId === projectId))) {
                    return {
                        errors: [
                            {
                                field: "user",
                                message: "friend request not sent",
                            },
                        ],
                    };
                }
                else {
                    newRequests = newRequests === null || newRequests === void 0 ? void 0 : newRequests.filter((req) => req.projectId !== projectId);
                }
            }
        }
        await User_1.User.update({ username }, { friendRequests: newRequests });
        return { user };
    }
    async deleteUser({ req }) {
        const userId = req.session.userId;
        if (!userId) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "no user found",
                    },
                ],
            };
        }
        const user = await User_1.User.findOne(userId);
        if (!user) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "no user found",
                    },
                ],
            };
        }
        await User_1.User.delete(userId);
        return { user };
    }
    async updateMessagingSettings({ req }, messagingSettings) {
        const userId = req.session.userId;
        if (!userId) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "no user found",
                    },
                ],
            };
        }
        const user = await User_1.User.findOne(userId);
        if (!user) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "no user found",
                    },
                ],
            };
        }
        await User_1.User.update({ id: userId }, { messagingSettings });
        return { user };
        ``;
    }
    async updateHasCreatedTask({ req }, hasCreated) {
        const userId = req.session.userId;
        if (!userId) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "no user found",
                    },
                ],
            };
        }
        const user = await User_1.User.findOne(userId);
        if (!user) {
            return {
                errors: [
                    {
                        field: "user",
                        message: "no user found",
                    },
                ],
            };
        }
        await User_1.User.update({ id: userId }, { hasCreatedTask: hasCreated });
        return { user };
    }
    async updateFeedback({ req }, feedback) {
        const id = req.session.userId;
        const user = await User_1.User.findOne(id);
        if (!user) {
            console.log("phone number already being used");
            return { errors: "phone number already being used" };
        }
        if (feedback) {
            const currFeedback = user === null || user === void 0 ? void 0 : user.feedback;
            const updateFeedback = currFeedback
                ? `${currFeedback} | ${feedback}`
                : feedback;
            await User_1.User.update({ id }, { feedback: updateFeedback });
        }
        return { user };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("ids", () => [type_graphql_1.Int])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "podUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => String, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("userIds", () => [type_graphql_1.Int])),
    __param(1, (0, type_graphql_1.Arg)("message", () => String)),
    __param(2, (0, type_graphql_1.Arg)("subject", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sendEmails", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("token")),
    __param(1, (0, type_graphql_1.Arg)("newPassword")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("phone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updatePhone", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("username")),
    __param(1, (0, type_graphql_1.Arg)("projectId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("podId", () => type_graphql_1.Int)),
    __param(3, (0, type_graphql_1.Arg)("isAdding", () => Boolean)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUserFriendRequests", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("messagingSettings", () => graphql_type_json_1.GraphQLJSONObject)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateMessagingSettings", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("hasCreated", () => Boolean)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateHasCreatedTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("feedback")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateFeedback", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map