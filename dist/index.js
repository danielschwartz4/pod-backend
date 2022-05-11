"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const body_parser_1 = __importDefault(require("body-parser"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const path_1 = __importDefault(require("path"));
const twilio_1 = require("twilio");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const Pod_1 = require("./entities/Pod");
const Project_1 = require("./entities/Project");
const User_1 = require("./entities/User");
const hello_1 = require("./resolvers/hello");
const pod_1 = require("./resolvers/pod");
const project_1 = require("./resolvers/project");
const user_1 = require("./resolvers/user");
dotenv_1.default.config();
const getOptions = async () => {
    let connectionOptions;
    connectionOptions = {
        type: "postgres",
        synchronize: constants_1.__prod__ ? false : true,
        logging: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        extra: {
            ssl: constants_1.__prod__ ? true : false,
        },
        entities: [User_1.User, Project_1.Project, Pod_1.Pod],
    };
    if (process.env.DATABASE_URL && constants_1.__prod__) {
        Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
    }
    else {
        Object.assign(connectionOptions, {
            database: "project-planner",
            username: "postgres",
            password: "Cessnap1",
        });
    }
    console.log(connectionOptions);
    return connectionOptions;
};
const connect2Database = async () => {
    const typeormconfig = await getOptions();
    await (0, typeorm_1.createConnection)(typeormconfig);
};
const main = async () => {
    connect2Database().then(async () => {
        console.log("Connected to database");
    });
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = constants_1.__prod__ ? new ioredis_1.default(process.env.REDIS_URL) : new ioredis_1.default();
    const corsOptions = {
        origin: constants_1.__prod__
            ? process.env.VERCEL_APP
            : process.env.LOCALHOST_FRONTEND,
        credentials: true,
    };
    console.log("IN PROD????");
    console.log(constants_1.__prod__);
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, cookie_parser_1.default)());
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
            sameSite: constants_1.__prod__ ? "none" : "lax",
            secure: constants_1.__prod__,
            domain: constants_1.__prod__ ? ".poddds.com" : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, user_1.UserResolver, project_1.ProjectResolver, pod_1.PodResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    let twilioClient;
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        twilioClient = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(body_parser_1.default.json());
    app.post("/api/messages", (req, res) => {
        res.header("Content-Type", "application/json");
        twilioClient.messages
            .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.to,
            body: req.body.body,
        })
            .then(() => {
            res.send(JSON.stringify({ success: true }));
        })
            .catch((err) => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
    });
    app.listen(parseInt(process.env.PORT) || 4000, () => {
        console.log("server started on port 4000");
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map