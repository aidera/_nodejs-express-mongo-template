const path = require('path');

const express = require('express');

const projectPath = require('../utils/project-paths');
const shopRoutes = require("./shop.router");
const authRoutes = require("./auth.router");

module.exports = (app) => {
  app.use(express.static(projectPath.public));
  app.use("/storage", express.static(projectPath.storage));

  app.use("/api/auth", authRoutes);
  app.use("/api/products", shopRoutes);

  app.use("/api", (req, res) => {
    res.status(400).send({error: {code: "NO_SUCH_METHOD", description: "There is no such method"}});
  });

  app.use((req, res) => {
    res.sendFile(path.join(projectPath.public, 'index.html'));
  });

};
