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
const hello_1 = require("./resolvers/hello");
const message_1 = require("./resolvers/message");
const pod_1 = require("./resolvers/pod");
const project_1 = require("./resolvers/project");
const recurringTask_1 = require("./resolvers/recurringTask");
const singleTask_1 = require("./resolvers/singleTask");
const user_1 = require("./resolvers/user");
dotenv_1.default.config();
const getOptions = async () => {
    let connectionOptions;
    connectionOptions = {
        type: "postgres",
        synchronize: constants_1.__prod__ ? true : true,
        logging: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: ["dist/entities/*.*"],
    };
    if (process.env.DATABASE_URL && constants_1.__prod__) {
        Object.assign(connectionOptions, {
            url: process.env.DATABASE_URL,
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        });
        Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
    }
    else {
        Object.assign(connectionOptions, {
            database: process.env.LOCALHOST_DATABASE,
            username: process.env.LOCALHOST_USERNAME,
            password: process.env.LOCALHOST_PASSWORD,
            extra: {
                ssl: constants_1.__prod__ ? true : false,
                rejectUnauthorized: constants_1.__prod__ ? true : false,
            },
        });
    }
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
    const redis = constants_1.__prod__
        ? new ioredis_1.default(process.env.REDIS_URL)
        : new ioredis_1.default(6379, "127.0.0.1");
    const corsOptions = {
        origin: constants_1.__prod__
            ? [
                process.env.VERCEL_APP,
                "https://google.com",
                "http://localhost:4000/graphql",
            ]
            : [
                process.env.LOCALHOST_FRONTEND,
                "https://studio.apollographql.com",
                "https://google.com",
                "http://localhost:4000/graphql",
            ],
        credentials: true,
    };
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
            resolvers: [
                hello_1.HelloResolver,
                user_1.UserResolver,
                project_1.ProjectResolver,
                pod_1.PodResolver,
                recurringTask_1.RecurringTaskResolver,
                singleTask_1.SingleTasksResolver,
                message_1.MessagesResolver,
            ],
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