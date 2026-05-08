import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import config from "./config";

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
    });
  });

  return io;
};

export const sendLiveNotification = (userId: string, payload: unknown) => {
  io?.to(`user:${userId}`).emit("notification", payload);
};
