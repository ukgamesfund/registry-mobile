import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

//@Entity()
export class Address {
	constructor() {
	}

	//@PrimaryGeneratedColumn()
	id: number;

	//@Column({name: 'ethAddress', nullable: false, unique: true})
	ethAddress: string;

	//@CreateDateColumn({nullable: true})
	created: Date;

	//@UpdateDateColumn({nullable: true})
	updated: Date;
}