var server;
var mongoose = require('mongoose');
var request = require('supertest');
const moment = require('moment');
var Rental = require('../../models/rental.js');
const User = require('../../models/users');
const Movie=require('../../models/movies');

describe('Return API', () => {
    
    let rental;
    let customer = mongoose.Types.ObjectId();
    let movie = mongoose.Types.ObjectId();
    let genreId = mongoose.Types.ObjectId();
    let movie1;
    beforeEach(async () => {
        
        server = require('../../server');
        movie1=new Movie({
            _id:movie,
            name:'Jumanji',
            dailyRentalRate:3,
            numberInStock:20,
            genre:{
                _id:genreId,
                name:'Genre 1'
            }
        });
        await movie1.save();

        rental = new Rental({
            customer: {
                _id: customer,
                name: 'Robert',
                phone: 7779998884
            },
            movie: {
                _id: movie,
                title: 'John WIck',
                dailyRentalRate: 3
            },
            genre: {
                _id: genreId,
                name: 'Genre 1'
            }

        });
        await rental.save();
        

    });

    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});
        // await server.close();
    });

    describe('Return API /', () => {

        // return 401 for no token
        // 
        it('ERROR TEST! Return 401 Error for No Token', async () => {
            const result = await request(server)
                .post('/api/returns')
                .send({ customer, movie });
            expect(result.status).toBe(401);
        });

        it('ERROR TEST! Return 400 Error for No Customer ID', async () => {
            const token = new User().createJWT();
            const result = await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ movie });
            expect(result.status).toBe(400);
        });

        it('ERROR TEST! Return 400 Error for No Movie ID', async () => {
            const token = new User().createJWT();
            const result = await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ customer });
            expect(result.status).toBe(400);
        });

        it('ERROR TEST! Return 404 Error for No Rental Found', async () => {
            const token = new User().createJWT();
            await Rental.remove({});
            const data = { customer: customer, movie: movie }
            const result = await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ customer, movie });
            expect(result.status).toBe(404);
        });

        it('ERROR TEST! Return 400 Error for Rental Already Set', async () => {
            rental.dateReturned = new Date();
            await rental.save();
            const token = new User().createJWT();
            const result = await request(server)

                .post('/api/returns')
                .set('token', token)
                .send({ customer, movie });
            expect(result.status).toBe(400);
        });

        // it('Success TEST! Return 200 Error for Valid Rental Request', async() => {
        //     await rental.save();
        //      const token=new User().createJWT();
        //      const result = await request(server)
        //          .post('/api/returns')
        //          .set('token',token)
        //          .send({customer,movie});
        //       expect(result.status).toBe(200);
        //  });

        it('Success TEST! Return Response 200 for Valid Rental Request and Should have dateReturned property set', async () => {
            await rental.save();
            const token = new User().createJWT();
            const result = await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ customer, movie });
            const diff = new Date() - Date.parse(result.body.dateReturned); 
            expect(result.status).toBe(200);
            expect(result.body.dateReturned).not.toBeNull();
            expect(diff).toBeLessThan(10000); // expecting the max time for posting the collection to be less than 10s
        });
        it('Success TEST! Return Response 200 for Valid Rental Request and Should have calculated rental', async () => {
            rental.dateOut = moment().add(-7, 'days').toDate();
            await rental.save();
            const token = new User().createJWT();
            const result = await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ customer, movie });
            const diff = new Date() - Date.parse(result.body.dateReturned);
            expect(result.status).toBe(200);
            expect(result.body.dateReturned).not.toBeNull();
            expect(result.body.rentalFee).toBe(21);
        });

        it('Success TEST! Return Successful Update of Movie Stock(+1)', async () => {

            await rental.save();
            const token = new User().createJWT();
            await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ customer, movie });            
          
            const result=await Movie.find({_id:movie});
            expect(result[0]._doc.numberInStock).not.toBeNull();
            expect(result[0]._doc.numberInStock).toBe(movie1.numberInStock+1);
        });

        it('Success TEST! Return Successful Update of Rental with status 200', async () => {
            rental.dateOut = moment().add(-7, 'days').toDate();
            await rental.save();
            const token = new User().createJWT();
            const result=await request(server)
                .post('/api/returns')
                .set('token', token)
                .send({ customer, movie });   
            expect(result.body).toHaveProperty('dateOut');
            expect(result.body).toHaveProperty('rentalFee');
            expect(result.body).toHaveProperty('customer');
            expect(result.body).toHaveProperty('movie');
            expect(result.body.rentalFee).not.toBeNull();
            expect(result.body.dateOut).not.toBeNull();
        });
    });


})