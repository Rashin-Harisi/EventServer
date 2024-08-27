const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);


server.patch('/events/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Get the post to update
  const event = router.db.get('events').find({ id: Number(id) }).value();

  if (!event) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Merge the updates into the existing post
  const updatedEvent = { ...event, ...updates };

  // Write back to the database
  router.db.get('events').find({ id: Number(id) }).assign(updatedEvent).write();

  res.status(200).json(updatedEvent);
});


server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});


// Export the Server API
module.exports = server;
