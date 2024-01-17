import {
  OneToOne,
  Ref,
  Entity,
  ManyToOne,
  ref,
  PrimaryKeyProp,
} from "@mikro-orm/core";
import { Account } from "./account.entity";
import { User } from "./user.entity";

@Entity()
export class Organization {
  @OneToOne({ primary: true })
  account!: Ref<Account>;

  @ManyToOne()
  owner!: Ref<User>;

  [PrimaryKeyProp]?: "account";

  constructor(account: Account, owner: User) {
    this.account = ref(account);
    this.owner = ref(owner);
  }
}
