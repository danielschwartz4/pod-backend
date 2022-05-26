import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Project } from "../entities/Project";
import { MyContext, ProjectInfoResponse, ProjectResponse } from "../types";
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
  async projects(@Ctx() { req }: MyContext): Promise<Project[] | undefined> {
    const userId = req.session.userId;
    const projects = await Project.find({ where: { userId: userId } });
    return projects;
  }

  @Query(() => [Project], { nullable: true })
  // !! Add errors
  async podProjects(
    @Arg("podId", () => Int) podId: number
  ): Promise<Project[] | undefined> {
    const projects = await Project.find({ where: { podId: podId } });
    return projects;
  }

  @Mutation(() => ProjectInfoResponse)
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
        podId: 0,
        userId: req.session.userId,
        projectName: projectOptions.projectName,
        overview: projectOptions.overview,
        milestones: projectOptions.milestones,
        milestoneDates: projectOptions.milestoneDates,
        milestoneProgress: projectOptions.milestoneProgress,
        groupSize: projectOptions.groupSize,
      }).save();
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return {
        errors: [
          {
            field: "unknown",
            message: "unknown",
          },
        ],
      };
    }
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProjectPod(@Arg("id") id: number, @Arg("podId") podId: number) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    await Project.update({ id }, { podId });
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProjectGroupSize(
    @Arg("id") id: number,
    @Arg("groupSize") groupSize: number
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    await Project.update({ id }, { groupSize });
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProjectProgress(
    @Arg("id") id: number,
    @Arg("milestoneProgress", () => [Int]) milestoneProgress: number[]
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    await Project.update({ id }, { milestoneProgress });
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProjectMilestones(
    @Arg("id") id: number,
    @Arg("milestones", () => [String]) milestones: string[]
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    await Project.update({ id }, { milestones });
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProjectMilestoneDates(
    @Arg("id") id: number,
    @Arg("milestoneDates", () => [String]) milestoneDates: string[]
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    await Project.update({ id }, { milestoneDates });
    return { project };
  }

  @Mutation(() => ProjectResponse)
  async updateProjectName(
    @Arg("id") id: number,
    @Arg("projectName", () => String) projectName: string
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    await Project.update({ id }, { projectName });
    return { project };
  }

  @Mutation(() => Boolean)
  async deleteProject(@Arg("id") id: number): Promise<boolean> {
    Project.delete(id);
    return true;
  }

  // // !! Move this to User
  // @Mutation(() => ProjectResponse)
  // async updateProjectFriendRequests(
  //   @Arg("id") id: number,
  //   @Arg("friendRequests", () => [String]) friendRequests: string[]
  // ) {
  //   if (friendRequests.length > 4) {
  //     return { errors: "too many friend requests" };
  //   }
  //   const project = await Project.findOne(id);
  //   if (!project) {
  //     console.log("project does not exist");
  //     return { errors: "project does not exist" };
  //   }
  //   await Project.update({ id }, { friendRequests });
  //   return { project };
  // }

  @Mutation(() => ProjectResponse)
  async updateProjectFriendProposals(
    @Arg("id") id: number,
    @Arg("friendProposals", () => [String]) friendProposals: string[]
  ) {
    if (friendProposals.length > 4) {
      return { errors: "too many friend proposals" };
    }
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }

    console.log(friendProposals);
    await Project.update({ id }, { friendProposals });
    return { project };
  }
}
