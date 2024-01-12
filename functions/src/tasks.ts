import * as express from "express";
import * as admin from "firebase-admin";

import { tasksCollection, usersCollection } from "./constants";
import { logger } from "firebase-functions/v1";
import { validateRequestBody } from "./validateRequestBody";
import { Timestamp } from "firebase-admin/firestore";

interface Task {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  completed: boolean;
}

interface TaskInput {
  title: string;
  category: string;
  date: string;
  description: string;
}

const taskInputValidator: Record<keyof TaskInput, (value: any) => boolean> = {
  title: (value) => typeof value === "string",
  description: (value) => typeof value === "string",
  date: (value) => typeof Date.parse(value) === "number",
  category: (value) =>
    value === "EVENT" || value === "TASK" || value === "ACHIEVEMENT",
};

export const createTask = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db = admin.firestore();
    const userId = req.query["id"] as string;
    if (!userId) {
      res.status(404).json({
        message: "ID de usuário não encontrado",
      });
      return;
    }

    const errors = validateRequestBody(req, taskInputValidator);
    if (errors.length > 0) {
      res.status(400).json({ message: errors });
      return;
    }

    const task: Task = req.body;
    const tasksCollectionRef = db
      .collection(usersCollection)
      .doc(userId)
      .collection(tasksCollection);
    task.completed = false;
    const resultingTask = await tasksCollectionRef.add({
      ...task,
      date: Timestamp.fromDate(new Date(task.date)),
    });
    task.id = resultingTask.id;

    res.status(200).json(task);
  } catch (exception) {
    logger.error(exception, { structuredData: true });
    res.status(500).json({
      message: "Ocorreu um erro inesperado!",
    });
  }
};
