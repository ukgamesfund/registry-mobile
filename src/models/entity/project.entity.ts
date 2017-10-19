import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import {Membership} from "./membership.entity";
import {Resolution} from "./resolution.entity";
import {Address} from "./address.entity";
import {User} from "./user.entity";

export enum ProjectState {
	Draft = 0,          // draft state, allows update operations only
	AwaitsConfirmation, // the initiator awaits confirmation from all founders
	Confirmed,          // all founders accepted the invitation
	Committed,          // final state, the initiator committed the project
	Declined            // final state, at least one of the founders declined the invitation
}

//@Entity()
export class Project {
	constructor() {
	}

	//@PrimaryGeneratedColumn()
	id: number;

	//@OneToOne(type => Address)
	//@JoinColumn({name: "address"})
	address: Address;

	//@OneToOne(type => User)
	//@JoinColumn({name: "initiator"})
	initiator: User;

	//@Column({name: 'name', nullable: false, unique: true})
	name: string;

	//@Column({name: 'email', nullable: false})
	email: string;

	//@Column({name:'state', nullable: false})
	state: ProjectState;

	//@Column('json', {name: 'details', nullable: true})
	details: any;

	//@OneToMany(type => Membership, membership => membership.project, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	memberships: Membership[];

	//@OneToMany(type => Resolution, resolution => resolution.project, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	resolutions: Resolution[];

	//@CreateDateColumn({nullable: true})
	created: Date;

	//@UpdateDateColumn({nullable: true})
	updated: Date;
}