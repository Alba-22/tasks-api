import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { createTask } from "./api/tasks/createTask";
import { getAllTasks } from "./api/tasks/getAllTasks";
import { getUserId } from "./api/users/getUserId";
import { editTask } from "./api/tasks/editTask";
import { deleteTask } from "./api/tasks/deleteTask";

admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

export const app = express();

app.post("/tasks", createTask);
app.get("/tasks", getAllTasks);
app.put("/tasks", editTask);
app.delete("/tasks", deleteTask);
app.get("/id", getUserId);

export const api = functions.https.onRequest(app);
