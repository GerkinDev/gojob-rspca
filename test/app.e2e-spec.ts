import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { assign } from 'lodash';

describe( 'AppController (e2e)', () => {
	let app;
	
	beforeEach( async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule( {
			imports: [AppModule],
		} ).compile();
		
		app = moduleFixture.createNestApplication();
		await app.init();
	} );
	
	it( '/ (GET)', () =>
		request( app.getHttpServer() )
		.get( '/' )
		.expect( 200 )
		.expect( 'Hello World!' ) );

	describe( 'Pet controller', () => {
		it( 'POST OK', ( done ) => {
			const petObj = {
				rfidId: '1234567890123456',
				species: 'dog',
				height: 75,
				weight: 15,
				description: 'A cutty doggo',
				dateArrival: new Date(),
			};
			request( app.getHttpServer() )
				.post( '/pets' )
				.send( petObj )
				.expect( 201 )
				.end( ( err, response ) => {
					expect( response.body ).toMatchObject( assign( {}, petObj, {dateArrival: petObj.dateArrival.toISOString()} ) );
					done();
				} );
		} );
		it( 'POST NOK: Validation error', ( done ) => 
			request( app.getHttpServer() )
				.post( '/pets' )
				.send( {
					rfidId: '1234567890123456a',
					species: 'dog',
					height: 75,
					weight: 15,
					description: 'A cutty doggo',
					dateArrival: new Date(),
				} )
				.expect( 422, done ) );
	} );
} );
