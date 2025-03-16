import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";

import { User } from "./User";
import { Importance } from "./Importance";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "timestamp" })
  dateTime: Date;

  @ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Importance, (importance) => importance.events, {
    eager: true,
  })
  importance: Importance;
}
