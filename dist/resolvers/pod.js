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
exports.PodResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Pod_1 = require("../entities/Pod");
const types_1 = require("../types");
const removeItem_1 = __importDefault(require("../utils/removeItem"));
let PodResolver = class PodResolver {
    async createPod(cap) {
        let pod;
        try {
            pod = await Pod_1.Pod.create({
                cap: cap,
                projectIds: [],
                userIds: [],
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
        newProjectIds = (0, removeItem_1.default)(newProjectIds, projectId);
        Pod_1.Pod.update({ id }, { projectIds: newProjectIds });
        let newUserIds = pod.userIds;
        newUserIds = (0, removeItem_1.default)(newUserIds, userId);
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
    async findPod(cap, projectId, { req }) {
        const userId = req.session.userId;
        const pods = await (0, typeorm_1.getConnection)().query(`select * from public.pod 
			where (${userId} != ANY(pod."userIds") and 
						${cap} = pod.cap and 
						${projectId} != ANY(pod."projectIds") and
						cardinality(pod."projectIds") < ${cap}) or
            (cardinality(pod."projectIds") = 0 and 
            cardinality(pod."userIds") = 0) and
            cardinality(pod."projectIds") < ${cap}
			`);
        if (pods.length == 0) {
            return { errors: "no available pods at the moment" };
        }
        console.log(pods);
        return { pod: pods[0] };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Pod_1.Pod),
    __param(0, (0, type_graphql_1.Arg)("cap")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
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
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PodResolver.prototype, "findPod", null);
PodResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PodResolver);
exports.PodResolver = PodResolver;
//# sourceMappingURL=pod.js.map