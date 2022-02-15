import express from "express";
import expressSession from "express-session";
import http from "http";
import { Server as SocketIO } from "socket.io";
import Knex from "knex";

import { env } from "./env";
import { logger } from "./logger";
import { setSocketIO } from "./socketio";
import { createRouter } from "./route";

import cors from "cors";
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./services/AuthService";
import { PollController } from "./controllers/PollController";
import { PollService } from "./services/PollService";

const PORT = env.PORT || 8080;
const app = express();
const server = new http.Server(app);
export const io = new SocketIO(server, {
    cors: {
        origin: "*",
    }
});

const knexConfigs = require("./knexfile");
const configMode = env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);

setSocketIO(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = expressSession({
    secret: "xy2-31x@.@??##err*u",
    resave: true,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
const wrap = (middleware: any) => (socket: any, next: any) =>
    middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

export const authService = new AuthService(knex);
export const authController = new AuthController(authService);
export const pollService = new PollService(knex);
export const pollController = new PollController(pollService);

let router = createRouter({ authController, pollController });
app.use(router);

const swaggerDocument = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(PORT, () => {
    logger.info(`Server ready： http://localhost:${PORT}/`);
});