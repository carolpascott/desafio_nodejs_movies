const { Router } = require("express");

const usersRoute = require("./users.routes");
const notesRoute = require("./notes.routes");
const tagsRoute = require("./tags.routes");

const routes = Router();

routes.use("/users", usersRoute);
routes.use("/notes", notesRoute);
routes.use("/tags", tagsRoute);

module.exports = routes;
