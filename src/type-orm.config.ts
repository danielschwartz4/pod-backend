import { Pod } from "./entities/Pod";
import { Project } from "./entities/Project";
import { User } from "./entities/User";

export default {
  type: "postgres",
  database: "project-planner",
  username: "postgres",
  password: "Cessnap1",
  logging: true,
  synchronize: true,
  entities: [User, Project, Pod],
} as any;
// change any to Parameters<Connection>
