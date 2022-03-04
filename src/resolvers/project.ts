import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Project } from "../entities/Project";
import { MyContext, ProjectResponse } from "../types";
import { ProjectInput } from "./ProjectInput";

@Resolver()
export class ProjectResolver {
  @Query(() => ProjectResponse, { nullable: true })
  async project(
    @Arg("id", () => Int) id: number
  ): Promise<ProjectResponse | undefined> {
    const project = await Project.findOne({ where: { id: id } });
    if (!project) {
      return { errors: "No project with this ID" };
    }
    return { project };
  }

  @Query(() => [Project], { nullable: true })
  // !! Add errors
  async projects(
    @Arg("userId", () => Int) userId: number
  ): Promise<Project[] | undefined> {
    const projects = await Project.find({ where: { userId: userId } });
    console.log(projects);
    // if (!projects) {
    //   return { errors: "No project with this ID" };
    // }
    return projects;
  }

  @Mutation(() => ProjectResponse)
  async addProjectInfo(
    @Arg("projectOptions") projectOptions: ProjectInput,
    @Ctx() { req }: MyContext
  ) {
    if (projectOptions.groupSize < 0 || projectOptions.groupSize > 4) {
      return {
        errors: [
          {
            field: "groupSize",
            message: "group size must be between 0 and 4",
          },
        ],
      };
    }
    let project;
    try {
      project = await Project.create({
        userId: req.session.userId,
        projectName: projectOptions.projectName,
        overview: projectOptions.overview,
        milestones: projectOptions.milestones,
        milestoneDates: projectOptions.milestoneDates,
        groupSize: projectOptions.groupSize,
      }).save();
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return "Cannot create project";
      // return {
      //   errors: [
      //     {
      //       field: "unknown",
      //       message: "unknown",
      //     },
      //   ],
      // };
    }
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg("id") id: number,
    // @Arg("podId") podId: number | null
    @Arg("podId") podId: number
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      return "project does not exist";
    }
    // if (typeof podId == null) {
    //   project.podId = null;
    //   project.save();
    //   return project;
    // }

    Project.update({ id }, { podId });
    return { project };
  }
}
