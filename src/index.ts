import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import { buildSchema } from "type-graphql";
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from "typeorm";
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
    synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    entities: [User, Project, Pod],
    // entities: ["dist/entities/*.*"],
  };

  if (process.env.DATABASE_URL) {
    Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  } else {
    connectionOptions = await getConnectionOptions();
  }
  return connectionOptions;
};

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
  const redis = new Redis(process.env.REDIS_URL);

  const corsOptions = {
    origin: __prod__
      ? (process.env.VERCEL_APP as string)
      : (process.env.LOCALHOST_FRONTEND as string),
    credentials: true,
  };

  console.log("IN PROD????");
  console.log(__prod__);
  // Add cors
  app.use(cors(corsOptions));

  // Add redis
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        // url: process.env.REDIS_URL,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: __prod__ ? "none" : "lax",
        secure: __prod__,
        // domain: __prod__
        //   ? "pod-frontend-erht5uzkw-danielschwartz4.vercel.app"
        //   : "localhost",
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

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log("server started on port 4000");
  });
};

main().catch((err) => {
  console.log(err);
});
