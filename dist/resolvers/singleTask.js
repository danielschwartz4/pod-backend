"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.SingleTasksResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const RecurringTask_1 = require("../entities/RecurringTask");
const SingleTask_1 = require("../entities/SingleTask");
const SingleTaskInput_1 = require("../types/SingleTaskInput");
const types_1 = require("../types/types");
const singleTaskUtils_1 = require("../utils/singleTaskUtils");
const sortTasksByDate_1 = require("../utils/sortTasksByDate");
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let SingleTasksResolver = class SingleTasksResolver {
    async singleTasks(taskId) {
        const qb = (0, typeorm_1.getConnection)()
            .getRepository(SingleTask_1.SingleTask)
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.user", "u", 'u.id=st."userId"')
            .orderBy('st."actionDate"')
            .where('st."taskId"=:taskId', { taskId: taskId });
        const tasks = await qb.getMany();
        if (!tasks) {
            return { errors: "Can't find any tasks" };
        }
        return { singleTasks: tasks };
    }
    async recentPodSingleTasks() {
        const qb = (0, typeorm_1.getConnection)()
            .getRepository(SingleTask_1.SingleTask)
            .createQueryBuilder("st")
            .innerJoinAndSelect("st.user", "u", 'u.id=st."userId"')
            .orderBy('st."createdAt"', "DESC")
            .where("st.notes != ''");
        const tasks = await qb.getMany();
        if (!tasks) {
            return { errors: "Can't find any tasks" };
        }
        return { singleTasks: tasks };
    }
    async singleTask(id) {
        const task = await SingleTask_1.SingleTask.findOne({ id });
        if (!task) {
            return { errors: "Task does not exist" };
        }
        return { singleTask: task };
    }
    async updateSingleTaskCompletionStatus(status, id) {
        const task = await SingleTask_1.SingleTask.findOne(id);
        if (!task) {
            console.log("task does not exist");
        }
        await SingleTask_1.SingleTask.update({ id }, { status });
        return { task };
    }
    async updateSingleTaskNotes(notes, id) {
        const task = await SingleTask_1.SingleTask.findOne(id);
        if (!task) {
            console.log("task does not exist");
        }
        await SingleTask_1.SingleTask.update({ id }, { notes });
        return { task };
    }
    async addSingleTask(singleTaskOptions) {
        let task;
        try {
            task = await SingleTask_1.SingleTask.create(Object.assign({}, singleTaskOptions)).save();
        }
        catch (_a) {
            return {
                errors: "cannot add task",
            };
        }
        return { task };
    }
    async addSingleTasksChunk(recTaskId, limit) {
        var _a, _b, _c, _d;
        const recurringTask = await RecurringTask_1.RecurringTask.findOne({
            where: { id: recTaskId },
        });
        if (!recurringTask) {
            return { errors: "must provide a recurring task as argument" };
        }
        let cursorDate = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.cursorDate;
        let chunkEndDate;
        let realEndDate;
        if (cursorDate == undefined) {
            cursorDate = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.startDate;
        }
        if (((_a = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _a === void 0 ? void 0 : _a.date) != null) {
            realEndDate = new Date((_b = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _b === void 0 ? void 0 : _b.date);
            chunkEndDate = (0, singleTaskUtils_1.minDate)((0, singleTaskUtils_1.addDays)(limit, cursorDate), realEndDate);
        }
        else if (((_c = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _c === void 0 ? void 0 : _c.repetitions) != null) {
            realEndDate = (0, singleTaskUtils_1.addDays)(((_d = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _d === void 0 ? void 0 : _d.repetitions) * 7, recurringTask.startDate);
            chunkEndDate = (0, singleTaskUtils_1.minDate)((0, singleTaskUtils_1.addDays)(limit, cursorDate), realEndDate);
        }
        else {
            chunkEndDate = (0, singleTaskUtils_1.addDays)(limit, cursorDate);
            realEndDate = chunkEndDate;
        }
        const selectedDays = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.days;
        const selectedDaysIdxs = (0, singleTaskUtils_1.extractDaysIdxs)(selectedDays);
        const singleTasksByDay = (0, singleTaskUtils_1.dataBetweenTwoDates)(cursorDate, chunkEndDate, selectedDaysIdxs);
        const nextDay = (0, singleTaskUtils_1.addDays)(1, chunkEndDate);
        let singleTasksArr = [];
        Object.keys(singleTasksByDay).forEach((key) => {
            if (selectedDaysIdxs.has(parseInt(key))) {
                const arr = singleTasksByDay[parseInt(key)];
                console.log("ARRRR", arr);
                arr.forEach(async (ele) => {
                    let resp = await SingleTask_1.SingleTask.create({
                        actionDate: ele.actionDate,
                        actionDay: ele.actionDay,
                        status: "tbd",
                        notes: "",
                        taskId: recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.id,
                        userId: recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.userId,
                    }).save();
                    singleTasksArr.push(resp);
                });
            }
        });
        if ((0, singleTaskUtils_1.minDate)(realEndDate, nextDay) != realEndDate) {
            await RecurringTask_1.RecurringTask.update({ id: recurringTask.id }, { cursorDate: nextDay });
        }
        const sortedTasks = (0, sortTasksByDate_1.sortTasksByDate)(singleTasksArr);
        return { singleTasks: sortedTasks };
    }
    async discordBot() {
        const client = new discord_js_1.default.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
        });
        console.log("Connecting to Discord...");
        await client.login(process.env.DISCORD_TOKEN);
        client.on("ready", () => {
            console.log("the bot is ready");
        });
        client.on("messageCreate", (message) => {
            console.log(message);
            message.reply({
                content: "pong",
            });
            if (message.content === "ping") {
                console.log("pong");
                message.reply({
                    content: "pong",
                });
            }
        });
        return "Success";
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => types_1.SingleTasksResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("taskId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "singleTasks", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.SingleTasksResponse, { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "recentPodSingleTasks", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.SingleTaskResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "singleTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("status")),
    __param(1, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "updateSingleTaskCompletionStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("notes")),
    __param(1, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "updateSingleTaskNotes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("singleTaskOptions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SingleTaskInput_1.SingleTaskInput]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "addSingleTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTasksResponse),
    __param(0, (0, type_graphql_1.Arg)("recTaskId")),
    __param(1, (0, type_graphql_1.Arg)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "addSingleTasksChunk", null);
__decorate([
    (0, type_graphql_1.Query)(() => String, { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "discordBot", null);
SingleTasksResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SingleTasksResolver);
exports.SingleTasksResolver = SingleTasksResolver;
//# sourceMappingURL=singleTask.js.map