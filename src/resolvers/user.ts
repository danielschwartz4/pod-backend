import argon2 from "argon2";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { In } from "typeorm";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { User } from "../entities/User";
import { MessagingSettings, MyContext, UserResponse } from "../types/types";
import { validateRegister } from "../utils/validateRegister";
import { UsernamePasswordInput } from "../types/UsernamePasswordInput";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { GraphQLJSONObject } from "graphql-type-json";

declare module "express-session" {
  interface SessionData {
    userId: any;
  }
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne({ id: req.session.userId });
    return user;
  }

  @Query(() => [User], { nullable: true })
  // !! Add errors
  async podUsers(
    @Arg("ids", () => [Int]) ids: number[]
  ): Promise<User[] | undefined> {
    const users = await User.find({ where: { id: In(ids) } });
    return users;
  }

  @Mutation(() => UserResponse)
  // !! Add isAuth middlewear
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ) {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    // const avatar = 'https://i.pravatar.cc/300?u=' + options.username;
    const avatar = Math.floor(Math.random() * 4) + 1;
    let user;
    try {
      user = await User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword,
        avatar: avatar,
      }).save();
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
      console.log("Error:", err.message);
    }
    req.session!.userId = user?.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session!.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    console.log(email);
    const user = await User.findOne({ where: { email } });
    console.log(email);
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password must be greater than 2 characters",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );
    await redis.del(key);

    // Login user after password change
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updatePhone(@Arg("id") id: number, @Arg("phone") phone: string) {
    const user = await User.findOne(id);
    if (!user) {
      console.log("phone number already being used");
      return { errors: "phone number already being used" };
    }
    const newPhone = phone.split("-").join("");
    console.log("NEW PHONEEE");
    console.log(newPhone);

    await User.update({ id }, { phone: newPhone });
    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updateUserFriendRequests(
    @Arg("username") username: string,
    @Arg("projectId", () => Int) projectId: number,
    @Arg("podId", () => Int) podId: number,
    @Arg("isAdding", () => Boolean) isAdding: boolean
  ) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "user does not exist",
          },
        ],
      };
    }
    let newRequests: { projectId: number; podId: number }[] = [];

    if (isAdding) {
      if (user.friendRequests === null) {
        newRequests = [{ projectId: projectId, podId: podId }];
      } else {
        newRequests = user.friendRequests;
        if (newRequests?.find((request) => request.projectId === projectId)) {
          return {
            errors: [
              {
                field: "user",
                message: "friend request already sent",
              },
            ],
          };
        } else {
          newRequests?.push({ projectId: projectId, podId: podId });
        }
      }
    } else {
      if (user.friendRequests === null) {
        return {
          errors: [
            {
              field: "user",
              message: "no friend requests",
            },
          ],
        };
      } else {
        newRequests = user.friendRequests;
        if (!newRequests?.find((request) => request.projectId === projectId)) {
          return {
            errors: [
              {
                field: "user",
                message: "friend request not sent",
              },
            ],
          };
        } else {
          newRequests = newRequests?.filter(
            (req) => req.projectId !== projectId
          );
        }
      }
    }

    await User.update({ username }, { friendRequests: newRequests });

    return { user };
  }

  @Mutation(() => UserResponse)
  async deleteUser(@Ctx() { req }: MyContext) {
    const userId = req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: "user",
            message: "no user found",
          },
        ],
      };
    }
    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "no user found",
          },
        ],
      };
    }
    await User.delete(userId);
    return { user };
  }

  @Mutation(() => UserResponse)
  async updateMessagingSettings(
    @Ctx() { req }: MyContext,
    @Arg("messagingSettings", () => GraphQLJSONObject)
    messagingSettings: MessagingSettings
  ) {
    const userId = req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: "user",
            message: "no user found",
          },
        ],
      };
    }
    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "no user found",
          },
        ],
      };
    }
    await User.update({ id: userId }, { messagingSettings });
    return { user };
    ``;
  }
}
