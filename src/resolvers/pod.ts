import { Pod } from "../entities/Pod";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { PodResponse } from "../types";
import removeItem from "../utils/removeItem";

@Resolver()
export class PodResolver {
  @Mutation(() => Pod)
  async createPod(
    @Arg("projectId") projectId: number,
    @Arg("cap") cap: number
  ) {
    let pod;
    try {
      pod = await Pod.create({
        cap: cap,
        projectIds: [projectId],
      }).save();
    } catch (err) {
      console.log("POD CREATION ERROR");
      console.log(err);
    }
    return pod;
  }

  @Mutation(() => PodResponse)
  async addProjectToPod(
    @Arg("id") id: number,
    @Arg("projectId") projectId: number,
    @Arg("userId") userId: number
  ) {
    const pod = await Pod.findOne(id);
    if (!pod) {
      return { errors: "pod does not exist" };
    }
    if (pod.projectIds.length + 1 > pod.cap) {
      return "cannot join pod since pod is full";
    }
    // Add project
    const newProjectIds = pod.projectIds;
    newProjectIds.push(projectId);
    Pod.update({ id }, { projectIds: newProjectIds });
    // Add user
    const newUserIds = pod.userIds;
    newUserIds.push(userId);
    Pod.update({ id }, { projectIds: newProjectIds });
    return { pod };
  }

  @Mutation(() => PodResponse)
  async removeProjectFromPod(
    @Arg("id") id: number,
    @Arg("projectId") projectId: number
  ) {
    const pod = await Pod.findOne(id);
    if (!pod) {
      return "pod does not exist";
    }
    let newProjectIds = pod.projectIds;

    newProjectIds = removeItem(newProjectIds, projectId);

    Pod.update({ id }, { projectIds: newProjectIds });
    return { pod };
  }

  @Query(() => Pod, { nullable: true })
  pod(@Arg("id") id: number): Promise<Pod | undefined> {
    return Pod.findOne(id);
  }
}
