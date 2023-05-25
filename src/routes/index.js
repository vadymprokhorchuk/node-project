const express = require("express");
const { users, usersRouter} = require("./users");
const {postsRouter} = require("./posts");

/* GET home page. */
const routes = (app) => {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
};

module.exports = routes;