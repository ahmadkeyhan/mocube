module.exports = app => {
  const types = require("../controllers/type.controller.js");

  var router = require("express").Router();

  router.post("/", types.create);

  router.get("/", types.findAll);

  router.get("/:id", types.findOne);

  app.use('/api/types', router);
};
