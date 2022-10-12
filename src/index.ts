import express from 'express'
import http from 'http'
import SocketWrapper from './socket';

async function setupServer() {
    const app = express();
    const server = http.createServer(app);
    const wrapper = new SocketWrapper(server)

    app.get('/demo', (req, res) => {
        res.sendFile(__dirname + '/demo.html')
    })

    server.listen(3000, () => {
        console.log('listening on *:3000');
    });

}

setupServer()
