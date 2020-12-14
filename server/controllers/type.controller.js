const db = require("../models");
const Type = db.types;

// Create and Save a new Type
exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const type = new Type({
    title: req.body.title,
    subtitle: req.body.subtitle,
    avatar: req.body.avatar,
    color: req.body.color,
    link: req.body.link
  });

  type
    .save(type)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Type."
      });
    });
};

// Retrieve all Types from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Type.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving types."
      });
    });
};

// Find a single Type with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Type.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Type with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
      .status(500)
      .send({ message: "Error retrieving Type with id=" + id });
    });
};
