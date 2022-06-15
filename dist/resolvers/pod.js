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
exports.PodResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Pod_1 = require("../entities/Pod");
const types_1 = require("../types/types");
const removeItem_1 = require("../utils/removeItem");
let PodResolver = class PodResolver {
    async createPod(isPrivate, cap, sessionType) {
        let pod;
        try {
            pod = await Pod_1.Pod.create({
                cap: cap,
                projectIds: [],
                userIds: [],
                isPrivate: isPrivate,
                sessionType: sessionType,
            }).save();
        }
        catch (err) {
            console.log("POD CREATION ERROR");
            console.log(err);
        }
        return pod;
    }
    pods() {
        return Pod_1.Pod.find();
    }
    async addProjectToPod(id, projectId, { req }) {
        const userId = req.session.userId;
        const pod = await Pod_1.Pod.findOne({ id });
        if (!pod) {
            return { errors: "pod does not exist" };
        }
        if (pod.projectIds.length + 1 > pod.cap) {
            return { errors: "cannot join pod since pod is full" };
        }
        const newProjectIds = pod.projectIds;
        newProjectIds.push(projectId);
        await Pod_1.Pod.update({ id }, { projectIds: newProjectIds });
        const newUserIds = pod.userIds;
        newUserIds.push(userId);
        await Pod_1.Pod.update({ id }, { userIds: newUserIds });
        return { pod };
    }
    async removeProjectFromPod(id, projectId, { req }) {
        const userId = req.session.userId;
        const pod = await Pod_1.Pod.findOne(id);
        if (!pod) {
            return { errors: "pod does not exist" };
        }
        let newProjectIds = pod.projectIds;
        newProjectIds = (0, removeItem_1.removeItemByValue)(newProjectIds, projectId);
        Pod_1.Pod.update({ id }, { projectIds: newProjectIds });
        let newUserIds = pod.userIds;
        newUserIds = (0, removeItem_1.removeItemByValue)(newUserIds, userId);
        Pod_1.Pod.update({ id }, { userIds: newUserIds });
        return { pod };
    }
    async pod(id) {
        if (id == undefined) {
            return { errors: "no pod" };
        }
        const pod = await Pod_1.Pod.findOne(id);
        if (!pod) {
            return { errors: "no pod with this id" };
        }
        return { pod };
    }
    async findPublicPod(cap, projectId, sessionType, { req }) {
        const userId = req.session.userId;
        const pods = await (0, typeorm_1.getConnection)().query(`SELECT * FROM public.pod 
			WHERE (${userId} != ANY(pod."userIds") AND
            ${projectId} != ANY(pod."projectIds") AND 
						${cap} = pod.cap AND
            pod."isPrivate" = false AND
						cardinality(pod."projectIds") < ${cap} AND
            pod."sessionType" = '${sessionType}') OR
            (${cap} = pod.cap AND
            cardinality(pod."projectIds") = 0 AND
            cardinality(pod."userIds") = 0 AND
            pod."sessionType" = '${sessionType}')
            ORDER BY cardinality(pod."projectIds") DESC
            LIMIT 1
			`);
        console.log("PODDDDDDDS");
        console.log(pods);
        if (pods.length == 0) {
            return { errors: "no available pods at the moment" };
        }
        console.log(pods);
        return { pod: pods[0] };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Pod_1.Pod),
    __param(0, (0, type_graphql_1.Arg)("isPrivate")),
    __param(1, (0, type_graphql_1.Arg)("cap")),
    __param(2, (0, type_graphql_1.Arg)("sessionType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number, String]),
    __metadata("design:returntype", Promise)
], PodResolver.prototype, "createPod", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Pod_1.Pod]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PodResolver.prototype, "pods", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.PodResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("projectId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PodResolver.prototype, "addProjectToPod", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.PodResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("projectId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PodResolver.prototype, "removeProjectFromPod", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.PodResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PodResolver.prototype, "pod", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.PodResponse),
    __param(0, (0, type_graphql_1.Arg)("cap")),
    __param(1, (0, type_graphql_1.Arg)("projectId")),
    __param(2, (0, type_graphql_1.Arg)("sessionType")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], PodResolver.prototype, "findPublicPod", null);
PodResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PodResolver);
exports.PodResolver = PodResolver;
//# sourceMappingURL=pod.js.map