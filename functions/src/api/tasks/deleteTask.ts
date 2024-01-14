import * as express from "express";
import * as admin from "firebase-admin";
import { verifyUserId } from "../../utils/verifyUserId";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { tasksCollection, usersCollection } from "../../utils/constants";
import { logger } from "firebase-functions/v1";

interface DeleteTaskInput {
  id: string;
}

const deleteTaskValidator: Record<
  keyof DeleteTaskInput,
  (value: any) => boolean
> = {
  id: (value) => typeof value === "string",
};

export const deleteTask = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    verifyUserId(req, res);
    validateRequestBody(req, res, deleteTaskValidator);

    const userId = req.query.userId as string;
    const taskId = req.body.id as string;

    const db = admin.firestore();

    await db
      .collection(usersCollection)
      .doc(userId)
      .collection(tasksCollection)
      .doc(taskId)
      .delete();

    res.status(200).json();
  } catch (exception) {
    logger.error(exception, { structuredData: true });
    res.status(500).json({
      message: "Ocorreu um erro inesperado!",
    });
  }
};
