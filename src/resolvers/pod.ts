import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Pod } from "../entities/Pod";
import { MyContext, PodResponse } from "../types";
import removeItem from "../utils/removeItem";

@Resolver()
export class PodResolver {
  @Mutation(() => Pod)
  async createPod(
    @Arg("projectId") projectId: number,
    @Arg("cap") cap: number,
    @Ctx() { req }: MyContext
  ) {
    let pod;
    const userId = req.session.userId;
    try {
      pod = await Pod.create({
        cap: cap,
        projectIds: [projectId],
        userIds: [userId],
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
    // @Arg("userId") userId: number
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const pod = await Pod.findOne(id);
    if (!pod) {
      return { errors: "pod does not exist" };
    }
    if (pod.projectIds.length + 1 > pod.cap) {
      return { errors: "cannot join pod since pod is full" };
    }
    // Add project
    const newProjectIds = pod.projectIds;
    newProjectIds.push(projectId);
    await Pod.update({ id }, { projectIds: newProjectIds });
    // Add user
    const newUserIds = pod.userIds;
    newUserIds.push(userId);
    await Pod.update({ id }, { userIds: newUserIds });
    return { pod };
  }

  @Mutation(() => PodResponse)
  async removeProjectFromPod(
    @Arg("id") id: number,
    @Arg("projectId") projectId: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const pod = await Pod.findOne(id);
    if (!pod) {
      return { errors: "pod does not exist" };
    }
    // Remove project
    let newProjectIds = pod.projectIds;
    newProjectIds = removeItem(newProjectIds, projectId);
    Pod.update({ id }, { projectIds: newProjectIds });
    // Add project
    let newUserIds = pod.userIds;
    newUserIds = removeItem(newUserIds, userId);
    Pod.update({ id }, { userIds: newUserIds });
    return { pod };
  }

  @Query(() => PodResponse, { nullable: true })
  async pod(@Arg("id") id: number): Promise<PodResponse> {
    if (id == undefined) {
      return { errors: "no pod" };
    }
    const pod = await Pod.findOne(id);
    if (!pod) {
      return { errors: "no pod with this id" };
    }
    return { pod };
  }

  @Query(() => PodResponse)
  async findPod(
    @Arg("cap") cap: number,
    @Arg("projectId") projectId: number,
    // @Arg("userId") userId: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const pods = await getConnection().query(
      `select * from public.pod 
			where ${userId} != ANY(pod."userIds") and 
						${cap} = pod.cap and 
						${projectId} != ANY(pod."projectIds")
			`
    );
    if (pods.length == 0) {
      return { errors: "no available pods at the moment" };
    }

    return { pod: pods[0] };
  }
}