import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PetSchema } from './pets.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { connect } from 'mongoose';

@Module( {
	imports: [MongooseModule.forFeature( [{ name: 'Pet', schema: PetSchema }] )],
	controllers: [PetsController],
	providers: [PetsService, {
		provide: getModelToken( 'Pet' ),
		useFactory: () => connect( 'mongodb://localhost/nest' ).then( connection => Promise.resolve( connection.model( 'Pet', PetSchema ) ) ),
	}],
} )
export class PetsModule {}
