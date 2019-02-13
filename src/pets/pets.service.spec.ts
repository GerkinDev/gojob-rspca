import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import { PetSchema } from './pets.schema';
import { times } from 'lodash';

const mockgoose = new Mockgoose( mongoose );

describe( 'PetsService', () => {
	let service: PetsService;
	
	beforeEach( async () => {
		await mockgoose.helper.reset();
		const module: TestingModule = await Test.createTestingModule( {
			providers: [PetsService, {
				provide: getModelToken( 'Pet' ),
				useFactory: async () => {
					await mockgoose.prepareStorage();
					return ( await mongoose.connect( 'mongodb://localhost/TestingDB' ) ).model( 'Pet', PetSchema );
				},
			}],
		} ).compile();
		
		service = module.get<PetsService>( PetsService );
	} );
	
	it( 'should be defined', () => {
		expect( service ).toBeDefined();
	} );
	describe( 'Insert', () => {
		it( 'Should insert a correctly configured pet', async () => {
			const pet = {
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			};
			expect( await service.insert( pet ) ).toMatchObject( pet );
		} );
		it( 'Should insert a correctly configured pet with RFID', async () => {
			const pet = {
				rfidId: '1234567890123456',
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			};
			expect( await service.insert( pet ) ).toMatchObject( pet );
		} );
		it( 'Should reject incomplete data', async () => {
			await expect( service.insert( {
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			} ) ).rejects.toThrow();
			await expect( service.insert( {
				species: 'dog',
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			} ) ).rejects.toThrow();
			await expect( service.insert( {
				species: 'dog',
				height: 75,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			} ) ).rejects.toThrow();
			await expect( service.insert( {
				species: 'dog',
				height: 75,
				weight: 15,
				dateArrival: new Date(),
			} ) ).rejects.toThrow();
			await expect( service.insert( {
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
			} ) ).rejects.toThrow();
			await expect( service.insert( {
				rfidId: '123456789',
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			} ) ).rejects.toThrow();
			await expect( service.insert( {
				rfidId: '123456789012345a',
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			} ) ).rejects.toThrow();
		} );
	} );
	describe( 'Find', () => {
		it( 'Should find an animal based on its ID', async () => {
			const petObj = {
				rfidId: '1234567890123456',
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			};
			const pet = await service.insert( petObj );

			expect( await service.find( pet.rfidId ) ).toMatchObject( petObj );
		} );
		it( 'Should not find an animal based on its ID', async () => {

			expect( await service.find( '6543210987654321' ) ).toBeNull();
		} );
	} );
	describe( 'FindAll', () => {
		it( 'Should return all animals LIFO', async () => {
			const petsObj = times( 25, () => ( {
				rfidId: '1234567890123456',
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			} ) );
			await Promise.all( petsObj.map( async petObj => {
				await service.insert( petObj );
			} ) );

			const found = await service.findAll( 0, 10 );
			expect( found ).toHaveLength( 10 );
			expect( found[0] ).toMatchObject( petsObj[24] );
		} );
	} );
} );
