const express = require('express');
const cors = require('cors');
const appRouter = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/', appRouter);

// 404 Error Handler
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
  };
  
app.use(unknownEndpoint);

module.exports = app;
