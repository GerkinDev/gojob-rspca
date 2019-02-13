import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

describe( 'Pets Controller', () => {
	let controller: PetsController;
	let service: PetsService;
	
	
	beforeEach( async () => {
		jest.clearAllMocks();
		
		const module: TestingModule = await Test.createTestingModule( {
			controllers: [PetsController],
			providers: [{
				provide: PetsService,
				useValue: {
					insert: async pet => pet,
					findAll: async () => [],
					find: async () => undefined,
				},
			}],
			
		} ).compile();
		
		controller = module.get<PetsController>( PetsController );
		service = module.get<PetsService>( PetsService );
	} );
	
	it( 'should be defined', () => {
		expect( controller ).toBeDefined();
	} );
	
	it( '`insert` should call `create` service method', async () => {
		const spy = jest.spyOn( service, 'insert' ).mockImplementation( async pet => pet as any );
		const petObj = {
			rfidId: '1234567890123456',
			species: 'dog',
			height: 75,
			weight: 15,
			description: 'A cutty doggo',
			dateArrival: new Date(),
		};
		await controller.insert( petObj );
		expect( spy ).toHaveBeenCalledWith( petObj );
		expect( spy ).toHaveBeenCalledTimes( 1 );
	} );
	
	
	it( '`find` should call `find` service method', async () => {
		const spy = jest.spyOn( service, 'find' ).mockImplementation( async () => undefined );
		await controller.find( '1234567890123456' );
		expect( spy ).toHaveBeenCalledWith( '1234567890123456' );
		expect( spy ).toHaveBeenCalledTimes( 1 );
	} );
	
	it( '`findAll` should call `findAll` service method', async () => {
		const spy = jest.spyOn( service, 'findAll' ).mockImplementation( async () => undefined );
		await controller.findAll( 0, 25 );
		expect( spy ).toHaveBeenCalledWith( 0, 25 );
		expect( spy ).toHaveBeenCalledTimes( 1 );
		await controller.findAll( 10, 5 );
		expect( spy ).toHaveBeenCalledWith( 10, 5 );
		expect( spy ).toHaveBeenCalledTimes( 2 );
	} );
} );
