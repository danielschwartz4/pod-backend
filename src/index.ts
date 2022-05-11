import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import { Twilio } from "twilio";
import { buildSchema } from "type-graphql";
import { ConnectionOptions, createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Pod } from "./entities/Pod";
import { Project } from "./entities/Project";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PodResolver } from "./resolvers/pod";
import { ProjectResolver } from "./resolvers/project";
import { UserResolver } from "./resolvers/user";
dotenv.config();

const getOptions = async () => {
  let connectionOptions: ConnectionOptions;
  connectionOptions = {
    type: "postgres",
    synchronize: __prod__ ? false : true,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Project, Pod],
    // entities: ["dist/entities/*.*"],
  };

  if (process.env.DATABASE_URL && __prod__) {
    Object.assign(connectionOptions, {
      url: process.env.DATABASE_URL,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
    Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  } else {
    Object.assign(connectionOptions, {
      database: "project-planner",
      username: "postgres",
      password: "Cessnap1",
      extra: {
        ssl: __prod__ ? true : false,
        rejectUnauthorized: __prod__ ? true : false,
      },
    });
  }
  return connectionOptions;
};

// const getOptions = async () => {
//   let connectionOptions: ConnectionOptions;
//   connectionOptions = {
//     type: "postgres",
//     synchronize: true,
//     logging: true,
//     migrations: [path.join(__dirname, "./migrations/*")],
//     extra: {
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     },
//     entities: [User, Project, Pod],
//     // entities: ["dist/entities/*.*"],
//   };

//   if (process.env.DATABASE_URL) {
//     Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
//   } else {
//     connectionOptions = await getConnectionOptions();
//   }
//   return connectionOptions;
// };

const connect2Database = async (): Promise<void> => {
  const typeormconfig = await getOptions();
  await createConnection(typeormconfig);
};

const main = async () => {
  connect2Database().then(async () => {
    console.log("Connected to database");
  });
  // await conn.runMigrations();

  const app = express();
  app.set("trust proxy", 1);

  const RedisStore = connectRedis(session);
  const redis = __prod__ ? new Redis(process.env.REDIS_URL) : new Redis();

  const corsOptions = {
    origin: __prod__
      ? (process.env.VERCEL_APP as string)
      : (process.env.LOCALHOST_FRONTEND as string),
    credentials: true,
  };

  // Add cors
  app.use(cors(corsOptions));

  app.use(cookieParser());

  // Add redis
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: __prod__ ? "none" : "lax",
        secure: __prod__,
        domain: __prod__ ? ".poddds.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  // Apollo Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, ProjectResolver, PodResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
    // cors: corsOptions,
  });

  // -------------Twilio---------------------------------------------

  // Twilio client
  let twilioClient: Twilio;
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  // Add body parser for Twilio
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

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

  app.listen(parseInt(process.env.PORT as string) || 4000, () => {
    console.log("server started on port 4000");
  });
};

main().catch((err) => {
  console.log(err);
});
