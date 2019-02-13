import { Controller, Post, Body, Param, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { IPet } from './pets.schema';

@Controller( 'pets' )
export class PetsController {
	public constructor( private petsService: PetsService ){}
	
	@Post()
	public async insert( @Body() newPet: IPet ){
		try{
			return await this.petsService.insert( newPet );
		} catch ( error ){
			if ( error.name === 'ValidationError' ){
				throw new HttpException( error.message, HttpStatus.UNPROCESSABLE_ENTITY );
			} else {
				throw error;
			}
		}
	}
	
	@Get( ':rfidId' )
	public find( @Param( 'rfidId' ) rfidId: string ){
		return this.petsService.find( rfidId );
	}
	
	@Get()
	public findAll( @Query( 'page' ) page = 0, @Query( 'limit' ) limit = 25 ){
		return this.petsService.findAll( page, limit );
	}
}
