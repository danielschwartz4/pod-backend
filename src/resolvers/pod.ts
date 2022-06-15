import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Pod } from "../entities/Pod";
import { MyContext, PodResponse, SessionType } from "../types/types";
import { removeItemByValue } from "../utils/removeItem";

@Resolver()
export class PodResolver {
  @Mutation(() => Pod)
  async createPod(
    @Arg("isPrivate") isPrivate: boolean,
    @Arg("cap") cap: number,
    @Arg("sessionType") sessionType: SessionType
  ): Promise<Pod | undefined> {
    let pod;
    try {
      pod = await Pod.create({
        cap: cap,
        projectIds: [],
        userIds: [],
        isPrivate: isPrivate,
        sessionType: sessionType,
      }).save();
    } catch (err) {
      console.log("POD CREATION ERROR");
      console.log(err);
    }
    return pod;
  }

  @Query(() => [Pod])
  pods() {
    return Pod.find();
  }

  @Mutation(() => PodResponse)
  async addProjectToPod(
    @Arg("id") id: number,
    @Arg("projectId") projectId: number,
    // @Arg("userId") userId: number
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const pod = await Pod.findOne({ id });
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
    newProjectIds = removeItemByValue(newProjectIds, projectId);
    Pod.update({ id }, { projectIds: newProjectIds });
    // Add project
    let newUserIds = pod.userIds;
    newUserIds = removeItemByValue(newUserIds, userId);
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

  // !! Make it so if project already in a pod it can't be in another one
  @Query(() => PodResponse)
  async findPublicPod(
    @Arg("cap") cap: number,
    @Arg("projectId") projectId: number,
    @Arg("sessionType") sessionType: SessionType,
    // @Arg("userId") userId: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const pods = await getConnection().query(
      `SELECT * FROM public.pod 
			WHERE (${userId} != ANY(pod."userIds") AND
            ${projectId} != ANY(pod."projectIds") AND 
						${cap} = pod.cap AND
            pod."isPrivate" = false AND
						cardinality(pod."projectIds") < ${cap} AND
            pod."sessionType" = '${sessionType}') OR
            (${cap} = pod.cap AND
            cardinality(pod."projectIds") = 0 AND
            cardinality(pod."userIds") = 0 AND
            pod."sessionType" = '${sessionType}')
            ORDER BY cardinality(pod."projectIds") DESC
            LIMIT 1
			`
    );
    // pod."sessionType" = ${sessionType}
    console.log("PODDDDDDDS");
    console.log(pods);
    if (pods.length == 0) {
      return { errors: "no available pods at the moment" };
    }
    console.log(pods);
    return { pod: pods[0] };
  }
}
