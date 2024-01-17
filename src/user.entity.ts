import {
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKeyProp,
  Property,
  Ref,
  ref,
  Collection,
} from "@mikro-orm/core";
import { Account } from "./account.entity";
import crypto from "crypto";
import { Organization } from "./organization.entity";

@Entity()
export class User {
  @OneToOne({ primary: true })
  account!: Ref<Account>;

  @Property()
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ hidden: true })
  salt!: string;

  @OneToMany(() => Organization, (org) => org.owner)
  organizations = new Collection<Organization>(this);

  [PrimaryKeyProp]?: "account";

  constructor(account: Account, username: string, password: string) {
    this.account = ref(account);
    this.username = username;

    const salt = crypto.randomBytes(16).toString("hex");
    this.salt = salt;
    this.password = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
  }
}
