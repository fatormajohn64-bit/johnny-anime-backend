import { Router } from "express";

import {
  addAnime,
  getAll,
  removeAnime,
  getDetails
} from "../controllers/library.controller.js";

const router = Router();

router.get("/", getAll);

router.post("/", addAnime);

router.get("/:id", getDetails);

router.delete("/:id", removeAnime);

export default router;
