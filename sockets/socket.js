// Socket messages
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init Server');

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('White Lies'));

console.log(bands);


io.on('connection', client => {
    console.log('Client connected');

    //? Connection

    client.on('disconnect',  () => {
        console.log('Client disconnected');
    });


    //?Tests
    
    client.on('message', (payload) => {
        console.log('Message received: '+payload.name)
        io.emit('message', {admin: 'New message received in the server'});
    });
    
    client.on('emit-message', (payload) => {
        client.broadcast.emit('emit-message', payload);
    })

    //? Bands CRUD

    //* Get bands
    client.emit('active-bands', bands.getBands());

    //* Vote or a band
    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
        console.log(payload);
    });

    //* Add band
    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
        console.log(payload);
    });

    //* Delete Band
    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
        console.log(payload);
    });
});