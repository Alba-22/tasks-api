import * as express from "express";
import * as admin from "firebase-admin";

import { tasksCollection, usersCollection } from "../../utils/constants";
import { logger } from "firebase-functions/v1";
import { Timestamp } from "firebase-admin/firestore";
import { verifyUserId } from "../../utils/verifyUserId";
import { Task } from "../../models/task";

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
