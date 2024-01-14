import * as express from "express";

export const verifyUserId = (req: express.Request, res: express.Response) => {
  const userId = req.query["userId"] as string;
  if (!userId) {
    res.status(404).json({
      message: "ID de usuário não encontrado",
    });
  }
};
