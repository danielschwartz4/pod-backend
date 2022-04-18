"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pod_1 = require("./entities/Pod");
const Project_1 = require("./entities/Project");
const User_1 = require("./entities/User");
exports.default = {
    type: "postgres",
    database: "project-planner",
    username: "postgres",
    password: "Cessnap1",
    logging: true,
    synchronize: true,
    entities: [User_1.User, Project_1.Project, Pod_1.Pod],
};
//# sourceMappingURL=type-orm.config.js.map