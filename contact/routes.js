const Contact = require('./contact');

module.exports = app => {
    // GET /api/contacts
    app.get('/api/contacts', (req, res, next) => {
        Contact.find((err, contacts) => {
            if (err) return next(err);
            res.json(contacts);
        });
    });

    // GET /api/contacts/:id
    app.get('/api/contacts/:id', (req, res, next) => {
        Contact.findById(req.params.id, (err, contact) => {
            if (err) return next(err);
            res.json(contact);
        })    
    });

    // POST /api/contacts
    app.post('/api/contacts', (req, res, next) => {
        Contact.create(req.body, (err, contact) => {
            if (err) return next(err);
            res.json({
                message: 'Contact created!',
                contact
            });
        });
    });

    // PUT /api/contacts/:id
    app.put('/api/contacts/:id', (req, res, next) => {
        Contact.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, contact) => {
            if (err) return next(err);
            res.json({
                message: 'Contact updated!',
                contact
            });
        });
    });

    // DELETE /api/contacts/:id
    app.delete('/api/contacts/:id', (req, res, next) => {
        Contact.findByIdAndRemove(req.params.id, req.body, (err, contact) => {
            if (err) return next(err);
            res.json({
                message: 'Contact deleted!',
                contact
            });
        });
    });
};