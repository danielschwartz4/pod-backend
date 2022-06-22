import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Project } from "../entities/Project";
import {
  MyContext,
  ProjectInfoResponse,
  ProjectResponse,
} from "../types/types";
import { ProjectInput } from "../types/ProjectInput";
import { getConnection, SelectQueryBuilder } from "typeorm";

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
  async projects(@Ctx() { req }: MyContext): Promise<Project[] | undefined> {
    const userId = req.session.userId;
    const projects = await Project.find({ where: { userId: userId } });
    return projects;
  }

  @Query(() => [Project], { nullable: true })
  async podProjects(
    @Arg("podId", () => Int) podId: number
  ): Promise<Project[] | undefined> {
    // ): Promise<SelectQueryBuilder<Project> | undefined> {
    // ) {
    // const projects = await Project.find({ where: { podId: podId } });
    const qb = getConnection()
      .getRepository(Project)
      .createQueryBuilder("p")
      .innerJoinAndSelect("p.user", "u", 'u.id=p."userId"')
      .orderBy('p."createdAt"')
      .where("p.podId = :podId", { podId });

    const projects = await qb.getMany();
    return projects;
  }

  @Mutation(() => ProjectInfoResponse)
  async addProjectInfo(@Arg("projectOptions") projectOptions: ProjectInput) {
    let project;
    try {
      project = await Project.create({
        ...projectOptions,
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

  @Mutation(() => ProjectResponse, { nullable: true })
  async updateProjectFriendProposals(
    @Arg("id") id: number,
    @Arg("isAdding", () => Boolean) isAdding: boolean,
    @Arg("addedFriends", () => [String]) addedFriends: string[],
    @Arg("deletedFriend", () => String) deletedFriend: string
  ) {
    const project = await Project.findOne(id);
    if (!project) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    let friendProposals = project.friendProposals;
    if (isAdding) {
      friendProposals = friendProposals
        ?.concat(addedFriends)
        .filter((friend) => friend != "");
      await Project.update({ id }, { friendProposals });
    } else {
      if (friendProposals?.includes(deletedFriend)) {
        const newProposals = friendProposals?.filter(
          (proposal) => proposal !== deletedFriend
        );
        await Project.update({ id }, { friendProposals: newProposals });
      } else {
        console.log("friend does not exist");
        return { errors: "friend does not exist" };
      }
    }
    return { project };
  }
}
