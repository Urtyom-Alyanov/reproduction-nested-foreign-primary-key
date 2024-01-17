import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  Ref,
  Enum,
} from "@mikro-orm/core";
import { User } from "./user.entity";
import { Organization } from "./organization.entity";

export enum AccountType {
  User = 1,
  Organiztion = 2,
}

@Entity()
export class Account {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  balance: number = 0;

  @OneToOne(() => User, "account")
  user?: Ref<User>;

  @OneToOne(() => Organization, "account")
  organization?: Ref<Organization>;

  @Enum()
  type!: AccountType;

  constructor(name: string, startBalance: number = 0, type = AccountType.User) {
    this.name = name;
    this.balance = startBalance;
    this.type = type;
  }
}
