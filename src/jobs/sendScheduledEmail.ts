require("dotenv").config();

async function main() {
  // await createConnection("poddds");
  // console.log("LOGGING USER");
  // // const user = await User.find({ where: { id: 1 } });
  // // console.log(user);
  // const qb = getConnection("poddds")
  //   .getRepository(RecurringTask)
  //   .createQueryBuilder("t")
  //   .select("t.id");
  // // .where("t.podId = :podId", { id: 31 });
  // const tasks = await qb.getMany();
  // console.log(tasks);
  // // sendCustomEmail("1kevin.huang@gmail.com");
}

main().catch((err) => console.log(err));
