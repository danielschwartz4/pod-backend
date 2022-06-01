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
exports.ProjectResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Project_1 = require("../entities/Project");
const types_1 = require("../types");
const ProjectInput_1 = require("./ProjectInput");
let ProjectResolver = class ProjectResolver {
    async project(id) {
        const project = await Project_1.Project.findOne({ where: { id: id } });
        if (!project) {
            return { errors: "No project with this ID" };
        }
        return { project };
    }
    async projects({ req }) {
        const userId = req.session.userId;
        const projects = await Project_1.Project.find({ where: { userId: userId } });
        return projects;
    }
    async podProjects(podId) {
        const projects = await Project_1.Project.find({ where: { podId: podId } });
        return projects;
    }
    async addProjectInfo(projectOptions, { req }) {
        let project;
        try {
            project = await Project_1.Project.create({
                podId: 0,
                userId: req.session.userId,
                projectName: projectOptions.projectName,
                overview: projectOptions.overview,
                milestones: projectOptions.milestones,
                milestoneDates: projectOptions.milestoneDates,
                milestoneProgress: projectOptions.milestoneProgress,
            }).save();
        }
        catch (err) {
            console.log("ERROR");
            console.log(err);
            return {
                errors: [
                    {
                        field: "unknown",
                        message: "unknown",
                    },
                ],
            };
        }
        return { project };
    }
    async updateProjectPod(id, podId) {
        const project = await Project_1.Project.findOne(id);
        if (!project) {
            console.log("project does not exist");
            return { errors: "project does not exist" };
        }
        await Project_1.Project.update({ id }, { podId });
        return { project };
    }
    async updateProjectProgress(id, milestoneProgress) {
        const project = await Project_1.Project.findOne(id);
        if (!project) {
            console.log("project does not exist");
            return { errors: "project does not exist" };
        }
        await Project_1.Project.update({ id }, { milestoneProgress });
        return { project };
    }
    async updateProjectMilestones(id, milestones) {
        const project = await Project_1.Project.findOne(id);
        if (!project) {
            console.log("project does not exist");
            return { errors: "project does not exist" };
        }
        await Project_1.Project.update({ id }, { milestones });
        return { project };
    }
    async updateProjectMilestoneDates(id, milestoneDates) {
        const project = await Project_1.Project.findOne(id);
        if (!project) {
            console.log("project does not exist");
            return { errors: "project does not exist" };
        }
        await Project_1.Project.update({ id }, { milestoneDates });
        return { project };
    }
    async updateProjectName(id, projectName) {
        const project = await Project_1.Project.findOne(id);
        if (!project) {
            console.log("project does not exist");
            return { errors: "project does not exist" };
        }
        await Project_1.Project.update({ id }, { projectName });
        return { project };
    }
    async deleteProject(id) {
        Project_1.Project.delete(id);
        return true;
    }
    async updateProjectFriendProposals(id, isAdding, addedFriends, deletedFriend) {
        const project = await Project_1.Project.findOne(id);
        if (!project) {
            console.log("project does not exist");
            return { errors: "project does not exist" };
        }
        let friendProposals = project.friendProposals;
        if (isAdding) {
            friendProposals = friendProposals === null || friendProposals === void 0 ? void 0 : friendProposals.concat(addedFriends).filter((friend) => friend != "");
            await Project_1.Project.update({ id }, { friendProposals });
        }
        else {
            if (friendProposals === null || friendProposals === void 0 ? void 0 : friendProposals.includes(deletedFriend)) {
                const newProposals = friendProposals === null || friendProposals === void 0 ? void 0 : friendProposals.filter((proposal) => proposal !== deletedFriend);
                await Project_1.Project.update({ id }, { friendProposals: newProposals });
            }
            else {
                console.log("friend does not exist");
                return { errors: "friend does not exist" };
            }
        }
        return { project };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => types_1.ProjectResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "project", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Project_1.Project], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "projects", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Project_1.Project], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("podId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "podProjects", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectInfoResponse),
    __param(0, (0, type_graphql_1.Arg)("projectOptions")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProjectInput_1.ProjectInput, Object]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "addProjectInfo", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("podId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProjectPod", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("milestoneProgress", () => [type_graphql_1.Int])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProjectProgress", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("milestones", () => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProjectMilestones", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("milestoneDates", () => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProjectMilestoneDates", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("projectName", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProjectName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "deleteProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ProjectResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("isAdding", () => Boolean)),
    __param(2, (0, type_graphql_1.Arg)("addedFriends", () => [String])),
    __param(3, (0, type_graphql_1.Arg)("deletedFriend", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Array, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProjectFriendProposals", null);
ProjectResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProjectResolver);
exports.ProjectResolver = ProjectResolver;
//# sourceMappingURL=project.js.map