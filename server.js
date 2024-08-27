const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);


server.patch('/posts/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Get the post to update
  const post = router.db.get('posts').find({ id: Number(id) }).value();

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Merge the updates into the existing post
  const updatedPost = { ...post, ...updates };

  // Write back to the database
  router.db.get('posts').find({ id: Number(id) }).assign(updatedPost).write();

  res.status(200).json(updatedPost);
});


server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});


// Export the Server API
module.exports = server;
