import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { createTask, getAllTasks } from "./api/tasks";
import { getUserId } from "./api/users";

admin.initializeApp();

export const app = express();

app.post("/tasks", createTask);
app.get("/tasks", getAllTasks);
app.get("/id", getUserId);

export const api = functions.https.onRequest(app);
