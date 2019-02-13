import { Schema, Document } from 'mongoose';
import * as Joi from 'joi';

export interface IPet {
	rfidId?: string;
	species: string;
	breed?: string;
	height: number;
	weight: number;
	description: string;
	dateArrival: Date;
}
export interface IPetModel extends IPet, Document {}

export const PetValidator = Joi.object().keys( {
	rfidId: Joi.string().regex( /^\d*$/ ).length( 16 ),
	species: Joi.string().required(),
	breed: Joi.string(),
	height: Joi.number().required(),
	weight: Joi.number().required(),
	description: Joi.string().required().min( 1 ),
	dateArrival: Joi.date().required(),
} );
export const PetSchema = new Schema<IPetModel>( {
	rfidId: String,
	species: String,
	breed: String,
	height: Number,
	weight: Number,
	description: String,
	dateArrival: Date,
} );
