import argon2 from "argon2";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection, In } from "typeorm";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { MyContext, UserResponse } from "../types";
import { validateRegister } from "../utils/validateRegister";
import { UsernamePasswordInput } from "./UsernamePasswordInput";

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
    let user;
    try {
      user = await User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword,
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
    console.log(req);
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
    await User.update({ id }, { phone });
    return { user };
  }

  @Mutation(() => UserResponse)
  async updateUserFriendRequests(
    // @Arg("id") id: number,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("friendRequests", () => [Int]) friendRequests: number[]
  ) {
    if (friendRequests.length > 4) {
      return { errors: "too many friend requests" };
    }
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      console.log("project does not exist");
      return { errors: "project does not exist" };
    }
    usernameOrEmail.includes("@")
      ? await User.update({ email: usernameOrEmail }, { friendRequests })
      : await User.update({ username: usernameOrEmail }, { friendRequests });

    return { user };
  }
}
