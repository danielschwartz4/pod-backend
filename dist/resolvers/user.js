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
const types_1 = require("../types");
const validateRegister_1 = require("../utils/validateRegister");
const UsernamePasswordInput_1 = require("./UsernamePasswordInput");
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
    async register(options, { req }) {
        const errors = (0, validateRegister_1.validateRegister)(options);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        let user;
        try {
            user = await User_1.User.create({
                username: options.username,
                email: options.email,
                password: hashedPassword,
            }).save();
        }
        catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken",
                        },
                    ],
                };
            }
            console.log("Error:", err.message);
        }
        req.session.userId = user === null || user === void 0 ? void 0 : user.id;
        return { user };
    }
    async login(usernameOrEmail, password, { req }) {
        console.log(req);
        const user = await User_1.User.findOne(usernameOrEmail.includes("@")
            ? { where: { email: usernameOrEmail } }
            : { where: { username: usernameOrEmail } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username doesn't exist",
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
        await User_1.User.update({ id }, { phone });
        return { user };
    }
    async updateUserFriendRequests(username, friendRequest, isAdding) {
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
                newRequests = [friendRequest];
            }
            else {
                newRequests = user.friendRequests;
                if (newRequests.includes(friendRequest)) {
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
                    newRequests.push(friendRequest);
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
                if (!newRequests.includes(friendRequest)) {
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
                    newRequests = newRequests.filter((id) => id !== friendRequest);
                }
            }
        }
        await User_1.User.update({ username }, { friendRequests: newRequests });
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
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("usernameOrEmail")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
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
    __param(1, (0, type_graphql_1.Arg)("friendRequest", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("isAdding", () => Boolean)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUserFriendRequests", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map