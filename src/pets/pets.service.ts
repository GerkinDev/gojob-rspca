import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPetModel as IPet, PetValidator, IPetModel } from './pets.schema';
import { Model } from 'mongoose';

@Injectable()
export class PetsService {
	public constructor( @InjectModel( 'Pet' ) private readonly petModel: Model<IPet> ) {}
	
	public async insert( newPet: Partial<IPet> ): Promise<IPetModel> {
		const valRes = PetValidator.validate( newPet );
		if ( valRes.error ){
			throw valRes.error;
		}
		
		const createdPet = new this.petModel( newPet );
		return createdPet.save();
	}
	
	public async find( rfidId: string ): Promise<IPetModel | undefined> {
		return this.petModel.findOne( {rfidId} );
	}

	public async findAll( page = 0, limit = 25 ){
		return this.petModel.find().sort( 'dateArrival desc' ).limit( limit ).skip( page * limit ).exec();
	}
}
