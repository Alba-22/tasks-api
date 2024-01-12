import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { createTask } from "./tasks";

admin.initializeApp();

export const app = express();

app.post("/tasks", createTask);

export const api = functions.https.onRequest(app);
