import path from "path";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { buildSchema } from "type-graphql";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/user";
import { HelloResolver } from "./resolvers/hello";
import cors from "cors";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Project } from "./entities/Project";
import { Pod } from "./entities/Pod";
import { ProjectResolver } from "./resolvers/project";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "project-planner",
    username: "postgres",
    password: "Cessnap1",
    migrations: [path.join(__dirname, "./migrations/*")],
    logging: true,
    synchronize: true,
    entities: [User, Project, Pod],
  });
  await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
      credentials: true,
    })
  );

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
        sameSite: "lax", //csrg
        // sameSite: "none",
        secure: __prod__, // cookie only works in https
        // secure: true,
      },
      saveUninitialized: false,
      secret: "randomstring",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, ProjectResolver],
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
