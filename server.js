const http = require('http');
const app = require('./app');
const { setupSocketIo } = require('./socket');
const server = http.createServer(app);

const port = process.env.PORT || 4000;


setupSocketIo(server);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

