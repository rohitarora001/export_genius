const http = require('http');
const app = require('./app');
const { setupSocketIo } = require('./socket');
const server = http.createServer(app);

const port = process.env.PORT || 3000;


setupSocketIo(server);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

