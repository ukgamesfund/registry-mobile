import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import {User} from "./user.entity";
import {Project} from "./project.entity";

export enum MembershipStatus {
	AwaitingInvite,
	Invited,
	Confirmed,
	Rejected
}

//@Entity()
export class Membership {
	constructor() {
	}

	//@PrimaryGeneratedColumn()
	id: number;

	//@Column({name: 'silver', nullable: false, default: 0})
	silver: number;

	//@Column({name: 'copper', nullable: false, default: 0})
	copper: number;

	//@ManyToOne(type => User, user => user.memberships, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	//@JoinColumn({name: "user"})
	user: User;

	//@ManyToOne(type => Project, project => project.memberships, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	//@JoinColumn({name: "project"})
	project: Project;

	//@Column({name: 'status', nullable: false})
	status: MembershipStatus;

	//@CreateDateColumn({nullable: true})
	created: Date;

	//@UpdateDateColumn({nullable: true})
	updated: Date;
}