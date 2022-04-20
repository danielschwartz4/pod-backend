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

// Typeorm connection
const main = async () => {
  connect2Database().then(async () => {
    console.log("Connected to database");
  });
  // await conn.runMigrations();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // Express server
  const app = express();

  // Add cors
  app.use(
    cors({
      origin: [
        process.env.LOCALHOST_FRONTEND as string,
        // process.env.LOCALHOST_BACKEND as string,
        process.env.VERCEL_APP as string,
      ],
      credentials: true,
    })
  );

  // Add redis
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        // disableTTL: true,
        url: process.env.REDIS_URL,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        // sameSite: "lax", //csrg
        // secure: __prod__, // cookie only works in https
        sameSite: "none",
        secure: true,
      },
      saveUninitialized: false,
      secret: "randomstring",
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
  });

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log("server started on port 4000");
  });
};

main().catch((err) => {
  console.log(err);
});
