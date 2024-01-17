import { MikroORM } from "@mikro-orm/sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { User } from "./user.entity";
import { Organization } from "./organization.entity";
import { Account, AccountType } from "./account.entity";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: "sqlite.db",
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
    metadataProvider: TsMorphMetadataProvider,
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  if (orm) await orm.close(true);
});

test("basic CRUD example", async () => {
  const ownerAcc = new Account("John Doe", 0, AccountType.User);
  const owner = new User(ownerAcc, "admin", "admin");
  orm.em.persist([ownerAcc, owner]);
  const orgAcc = new Account("Example Comp.", 0, AccountType.Organiztion);
  const newOrg = new Organization(orgAcc, owner);
  orm.em.persist([orgAcc, newOrg]);
  await orm.em.flush();
  orm.em.clear();

  const account = await orm.em.findOneOrFail(Account, {
    name: "Example Comp.",
  });
  expect(account.name).toBe("Example Comp.");
  account.name = "Example Supercomp.";
  orm.em.remove(account);
  await orm.em.flush();

  const count = await orm.em.count(Account, { name: "Example Comp." });
  expect(count).toBe(0);
});
