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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Message_1 = require("../entities/Message");
const types_1 = require("../types/types");
let MessagesResolver = class MessagesResolver {
    async messages(podId) {
        const qb = (0, typeorm_1.getConnection)()
            .getRepository(Message_1.Message)
            .createQueryBuilder("message")
            .innerJoinAndSelect("message.user", "u", 'u.id=message."userId"')
            .innerJoinAndSelect("message.task", "t", 't.id=message."taskId"')
            .orderBy('message."createdAt"', "DESC")
            .where('t."podId"=:podId', { podId: podId });
        const messages = await qb.getMany();
        if (!messages) {
            return {
                errors: "no messages",
            };
        }
        return { messages: messages };
    }
    async addMessage({ req }, taskId, message) {
        let messageRes;
        if (message === "") {
            return {
                errors: [
                    {
                        field: "message",
                        message: "Message can't be empty",
                    },
                ],
            };
        }
        try {
            messageRes = await Message_1.Message.create({
                message: message,
                taskId: taskId,
                userId: req.session.userId,
            }).save();
        }
        catch (_a) {
            return {
                errors: [
                    {
                        field: "message",
                        message: "cannot send message",
                    },
                ],
            };
        }
        return { message: messageRes };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => types_1.MessagesResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("podId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessagesResolver.prototype, "messages", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.MessageResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("taskId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("message", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], MessagesResolver.prototype, "addMessage", null);
MessagesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MessagesResolver);
exports.MessagesResolver = MessagesResolver;
//# sourceMappingURL=message%202.js.map