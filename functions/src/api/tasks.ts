import * as express from "express";
import * as admin from "firebase-admin";

import { tasksCollection, usersCollection } from "../utils/constants";
import { logger } from "firebase-functions/v1";
import { validateRequestBody } from "../utils/validateRequestBody";
import { Timestamp } from "firebase-admin/firestore";
import { verifyUserId } from "../utils/verifyUserId";

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
  res: express.Response
) => {
  try {
    verifyUserId(req, res);
    validateRequestBody(req, res, taskInputValidator);

    const db = admin.firestore();

    const userId = req.query["id"] as string;

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

export const getAllTasks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    verifyUserId(req, res);

    const db = admin.firestore();
    const userId = req.query["id"] as string;

    const tasksSnapshot = await db
      .collection(usersCollection)
      .doc(userId)
      .collection(tasksCollection)
      .get();

    const tasks: Task[] = tasksSnapshot.docs.map((e) => {
      return {
        id: e.id,
        title: e.data().title,
        category: e.data().category,
        completed: e.data().completed,
        description: e.data().description,
        date: (e.data().date as Timestamp).toDate().toISOString(),
      };
    });

    res.status(200).json(tasks);
  } catch (exception) {
    logger.error(exception, { structuredData: true });
    res.status(500).json({
      message: "Ocorreu um erro inesperado!",
    });
  }
};
