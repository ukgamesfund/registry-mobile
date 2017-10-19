import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import {Membership} from "./membership.entity";
import {Vote} from "./vote.entity";
import {Address} from "./address.entity";

//@Entity()
export class User {
	constructor() {
	}

	//@PrimaryGeneratedColumn()
	id: number;

	//@OneToOne(type => Address)
	//@JoinColumn({name: "address"})
	address: Address;

	//@Column({name: 'email', nullable: false, unique: true})
	email: string;

	//@Column({name: 'name', nullable: true})
	name: string;

	//@Column('json', {name: 'details', nullable: true})
	details: any;

	//@Column({name: 'admin', nullable: false, default: false})
	admin: boolean;

	//@OneToMany(type => Membership, membership => membership.user, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	memberships: Membership[];

	//@OneToMany(type => Vote, vote => vote.user, {cascadeInsert: false,cascadeUpdate: false,lazy: false})
	votes: Vote[];

	//@CreateDateColumn({nullable: true})
	created: Date;

	//@UpdateDateColumn({nullable: true})
	updated: Date;
}