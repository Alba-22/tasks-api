import * as express from "express";
import * as admin from "firebase-admin";
import { usersCollection } from "../utils/constants";

export const getUserId = async (
  req: express.Request,
  res: express.Response
) => {
  const db = admin.firestore();
  const nickname = req.query["nickname"];
  if (!nickname) {
    res.status(400).json({
      message: "Informe o parâmetro 'nickname' para obter o id de usuário",
    });
    return;
  }
  const search = await db
    .collection(usersCollection)
    .where("nickname", "==", nickname)
    .get();
  if (!search.empty) {
    res.status(200).json({
      id: search.docs[0].id,
    });
  } else {
    const result = await db.collection(usersCollection).add({
      nickname: nickname,
    });
    res.status(200).json({
      id: result.id,
    });
  }
};
