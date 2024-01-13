import * as express from "express";
import { verifyUserId } from "../../utils/verifyUserId";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { logger } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { tasksCollection, usersCollection } from "../../utils/constants";
import { Timestamp } from "firebase-admin/firestore";

interface EditTaskInput {
  id: string;
}

const editTaskValidator: Record<keyof EditTaskInput, (value: any) => boolean> =
  {
    id: (value) => typeof value === "string",
  };

export const editTask = async (req: express.Request, res: express.Response) => {
  try {
    verifyUserId(req, res);
    validateRequestBody(req, res, editTaskValidator);

    const taskId = req.body.id;
    const userId = req.query.id as string;

    const db = admin.firestore();

    const tasksCollectionRef = db
      .collection(usersCollection)
      .doc(userId)
      .collection(tasksCollection);

    const taskSnapshot = await tasksCollectionRef.doc(taskId).get();

    if (!taskSnapshot.exists) {
      res.status(400).json({
        message: "Não foi encontrada uma tarefa para o dado id",
      });
    }

    await tasksCollectionRef.doc(taskId).update({
      title: req.body.title,
      category: req.body.category,
      date: req.body.date
        ? Timestamp.fromDate(new Date(req.body.date))
        : undefined,
      description: req.body.description,
      completed: req.body.completed,
    });

    res.status(200).json();
  } catch (exception) {
    logger.error(exception, { structuredData: true });
    res.status(500).json({
      message: "Ocorreu um erro inesperado!",
    });
  }
};
