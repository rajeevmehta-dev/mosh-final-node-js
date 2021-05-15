var server;
const request = require('supertest');
const Genres = require('../../models/genres');
const User = require('../../models/users');
const mongoose = require('mongoose');

// TEST FILE FOR GENRES API
describe('Genres APIs', () => {

    beforeEach(async () => {
        
        server = require('../../server');

    });

    afterEach(async () => {
        await Genres.remove({});
    //    await server.close();

    });
    // async/await approach used in all tests
    describe('GET /', () => {
        it('SUCCESS TEST! Should Get all Genres', async () => {
            const data = [{ name: 'Horror' }, { name: 'Thriller' }]; //setting object for passing
            await Genres.insertMany(data);  // inserts multiple genres
            const result = await request(server).get('/api/genre');
            expect(result.status).toBe(200);
            expect(result.body.length).toBe(2);
            expect(result.body.some(g => g.name === 'Horror')).toBeTruthy();
            expect(result.body.some(g => g.name === 'Thriller')).toBeTruthy();
        });

        it('SUCCESS TEST! It should return Genre by specific ID', async () => {
            const genre = new Genres({ name: "Comedy" });   //setting object for passing
            await genre.save()  //saving the document
            const result = await request(server).get('/api/genre/' + genre._id);    //get the saved document
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('name', genre.name);
            // checks on returned document
        });

        it('ERROR TEST! Return error 404 on invalid Object Id', async () => {
            const result = await request(server).get('/api/genre/yhjgfw678688888');
            expect(result.status).toBe(400);
        });

    });

    describe('POST Genre /', () => {
        it('ERROR TEST! Return Genre post error for no token', async () => {
            const result = await request(server).post('/api/genre').send({ name: 'Thriller' });
            expect(result.status).toBe(401);
        });
        it('ERROR TEST! Return Genre post error for Genre less than 5 characters', async () => {
            const token = new User().createJWT();
            const result = await request(server)
                .post('/api/genre')
                .set('token', token)
                .send({ name: 'Thri' });
                expect(result.status).toBe(400);
        });
        it('ERROR TEST! Return Genre post error for Genre more than 50 characters', async () => {
            const token = new User().createJWT();
            const name = new Array(12).join('a');
            const result = await request(server)
                .post('/api/genre')
                .set('token', token)
                .send({ name: name });
                expect(result.status).toBe(400);
        });
        it('it should return Genre post success for a Valid Genre and Token Input', async () => {
            const token = new User().createJWT();
            const result = await request(server)
                .post('/api/genre')
                .set('token', token)
                .send({ name: 'Thriller' });
                expect(result.status).toBe(201);
                expect(result.body).toHaveProperty('name', 'Thriller');
        });
    });

    describe('Update/PUT Genre /:id', () => {
        it('ERROR TEST! Return error for no Token', async () => {

            const result = await request(server)
                .put('/api/genre/443eerttt')
                .send({ 'name': 'Horror' });
                expect(result.status).toBe(401);
        });
        it('ERROR TEST! Return 400 Error for Invalid ID', async () => {
            const token = await new User().createJWT();
            const result = await request(server)
                .put('/api/genre/34344445dd')
                .set('token', token)
                .send({ name: 'Genre 1' });
                expect(result.status).toBe(400);
        });
        it('ERROR TEST! Return an Error for Invalid Genre Name(Less than 5)', async () => {
            const token = await new User().createJWT();
            const genre = new Genres({ name: 'Dark' })
            await genre.save();
            const result = await request(server)
                .put('/api/genre/' + genre._id)
                .set('token', token)
                .send({ name: 'abc' });
                expect(result.status).toBe(400);

        });
        it('ERROR TEST! Return an Error for Invalid Genre Name(More than 10)', async () => {
            const token = await new User().createJWT();
            const genre = new Genres({ name: 'Dark' })
            const name = new Array(12).join('a');
            await genre.save();
            const result = await request(server)
                .put('/api/genre/' + genre._id)
                .set('token', token)
                .send({ name: name });
                 expect(result.status).toBe(400);

        });
        it('SUCCESS Test! Return Genre Update Success for Valid token,name and ID', async () => {
            const token = await new User().createJWT();
            const genre = new Genres({ name: 'Horor' });
            await genre.save();
            const result = await request(server)
                .put('/api/genre/' + genre._id)
                .set('token', token)
                .send({ name: 'Horror' });
                expect(result.body).toHaveProperty('nModified', 1);
        });
    });

    describe('Delete Genre /:id', () => {
        it('ERROR TEST! Return error for no Token', async () => {
            const result = await request(server)
                .delete('/api/genre/443eerttt')
                expect(result.status).toBe(401);
        });
        it('ERROR TEST! Return 400 Error for Invalid ID', async () => {
            const token = await new User().createJWT();
            const result = await request(server)
                .delete('/api/genre/34344445dd')
                .set('token', token)
                expect(result.status).toBe(400);
        });
        it(' SUCCESS TEST! Should Return Delete Success', async () => {
            const token = await new User().createJWT();
            const genre = new Genres({
                name: 'Horror'
            });
            await genre.save();
            const result = await request(server)
                .delete('/api/genre/' + genre._id)
                .set('token', token);
                expect(result.body).toMatchObject({ ok: 1, n: 1 });
        });
        it('FAILURE TEST! Should Return Delete Failure', async () => {
            const token = await new User().createJWT();
            const id = mongoose.Types.ObjectId();
            const result = await request(server)
                .delete('/api/genre/' + id)
                .set('token', token);
                expect(result.body).toMatchObject({ ok: 1, n: 0 });
        });
    });
});