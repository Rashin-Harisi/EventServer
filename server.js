const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const waitForDbWrite = (req, res, next) => {
  next(); // Continue request processing
  req.on('end', async () => { // After request processing finishes
      if (req.method === 'PATCH') {
          const { id } = req.params;
          await router.db.get('events').find({ id: id }).write(); // Wait for DB write
      }
  });
};

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(waitForDbWrite);


server.patch('/events/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  console.log("updates",updates.increase);

  
  const event = router.db.get('events').find({ id: id }).value();

  if (!event) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (updates.increase) {
    event.quantity = event.quantity ? event.quantity + 1 : 1;
  }
  
  router.db.get('events').find({ id: id }).assign(event).write();
  //const updatedEvent = router.db.get('events').find({ id: id }).value();
  

  res.status(200).json(event);
});


server.get('/events', (req, res) => {
  

  // Get the post to update
  const events = router.db.get('events').value();

  if (!events) {
    return res.status(404).json({ error: 'Events not found' });
  }

  res.status(200).json(events);
});



server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});


// Export the Server API
module.exports = server;
