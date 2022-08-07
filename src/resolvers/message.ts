import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Message } from "../entities/Message";
import { MessageResponse, MessagesResponse, MyContext } from "../types/types";

@Resolver()
export class MessagesResolver {
  @Query(() => MessagesResponse, { nullable: true })
  async messages(
    @Arg("podId", () => Int) podId: number
  ): Promise<MessagesResponse | undefined> {
    const qb = getConnection()
      .getRepository(Message)
      .createQueryBuilder("message")
      .innerJoinAndSelect("message.user", "u", 'u.id=message."userId"')
      .innerJoinAndSelect("message.task", "t", 't.id=message."taskId"')
      .orderBy('message."createdAt"')
      .where('t."podId"=:podId', { podId: podId });
    const messages = await qb.getMany();
    if (!messages) {
      return {
        errors: "no messages",
      };
    }
    return { messages: messages };
  }

  @Mutation(() => MessageResponse)
  async addMessage(
    // @Ctx() { req }: MyContext,
    @Arg("userId", () => Int) userId: number,
    @Arg("taskId", () => Int) taskId: number,
    @Arg("message", () => String) message: string
  ) {
    let messageRes;
    if (message === "") {
      return {
        errors: [
          {
            field: "message",
            message: "Message can't be empty",
          },
        ],
      };
    }
    try {
      messageRes = await Message.create({
        message: message,
        taskId: taskId,
        userId: userId,
        // userId: req.session.userId,
      }).save();
    } catch {
      return {
        errors: [
          {
            field: "message",
            message: "cannot send message",
          },
        ],
      };
    }
    return { message: messageRes };
  }
}
