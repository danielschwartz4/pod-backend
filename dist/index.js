"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const type_graphql_1 = require("type-graphql");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const user_1 = require("./resolvers/user");
const hello_1 = require("./resolvers/hello");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("./constants");
const Project_1 = require("./entities/Project");
const Pod_1 = require("./entities/Pod");
const main = async () => {
    const conn = await (0, typeorm_1.createConnection)({
        type: "postgres",
        database: "project-planner",
        username: "postgres",
        password: "Cessnap1",
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        logging: true,
        synchronize: true,
        entities: [User_1.User, Project_1.Project, Pod_1.Pod],
    });
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, cors_1.default)({
        origin: ["https://studio.apollographql.com", "http://localhost:3000"],
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTTL: true,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: "randomstring",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log("server started on port 4000");
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map