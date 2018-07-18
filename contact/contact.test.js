process.env.NODE_ENV = 'test';
process.env.PORT = 5000;

const mongoose = require("mongoose");
const Contact = require('./contact');

const chai = require('chai');
const factories = require('chai-factories');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(factories);
chai.use(chaiHttp);

chai.factory('contact', {
    first_name: 'John',
    last_name: 'Doe',
    address: 'Unknown',
    email_address: 'john@doe.com',
    contact_number: '09771234567'
});

describe('Contacts', () => {
    beforeEach((done) => {
        Contact.remove({}, (err) => {
            done();
        });
    });

    describe('GET /api/contacts', () => {
        it('it should GET all the contacts', (done) => {
            chai.request(server)
                .get('/api/contacts')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('POST /api/contacts', () => {
        it('it should POST a new contact', (done) => {
            chai.request(server)
                .post('/api/contacts')
                .send(chai.create('contact'))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact created!');
                    res.body.contact.should.have.property('first_name');
                    res.body.contact.should.have.property('last_name');
                    res.body.contact.should.have.property('address');
                    res.body.contact.should.have.property('contact_number');
                    res.body.contact.should.have.property('email_address');
                    done();
                });
        });

        it('it should NOT POST a new contact with existing email address', (done) => {
            const contact = new Contact(chai.create('contact'));
            contact.save((err, contact) => {
                chai.request(server)
                .post('/api/contacts')
                .send(chai.create('contact', {'contact_number': '09111234567'}))
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.have.property('errmsg');
                    done();
                });
            });
        });

        it('it should NOT POST a new contact with existing contact number', (done) => {
            const contact = new Contact(chai.create('contact'));
            contact.save((err, contact) => {
                chai.request(server)
                .post('/api/contacts')
                .send(chai.create('contact', {'email_address': 'john1@doe.com'}))
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.have.property('errmsg');
                    done();
                });
            });
        });
    });

    describe('GET /api/contacts/:id', () => {
        it('it should GET a contact by a given ID', (done) => {
            const contact = new Contact(chai.create('contact'));
            contact.save((err, contact) => {
                chai.request(server)
                .get('/api/contacts/' + contact.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('first_name');
                    res.body.should.have.property('last_name');
                    res.body.should.have.property('address');
                    res.body.should.have.property('contact_number');
                    res.body.should.have.property('email_address');
                    res.body.should.have.property('_id').eql(contact.id);
                    done();
                });
            });
        });
    });

    describe('PUT /api/contacts/:id', () => {
        it('it should UPDATE a contact by a given ID', (done) => {
            const contact = new Contact(chai.create('contact'));
            contact.save((err, contact) => {
                chai.request(server)
                .put('/api/contacts/' + contact.id)
                .send(chai.create('contact', {first_name: 'Johnny', last_name: 'English'}))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact updated!');
                    res.body.contact.should.have.property('first_name').eql('Johnny');
                    res.body.contact.should.have.property('last_name').eql('English');
                    done();
                });
            });
        });
    });

    describe('DELETE /api/contacts/:id', () => {
        it('it should DELETE a contact by a given ID', (done) => {
            const contact = new Contact(chai.create('contact'));
            contact.save((err, contact) => {
                chai.request(server)
                .delete('/api/contacts/' + contact.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eql('Contact deleted!');
                    res.body.contact.should.have.property('_id').eql(contact.id);
                    done();
                });
            });
        })
    })
});