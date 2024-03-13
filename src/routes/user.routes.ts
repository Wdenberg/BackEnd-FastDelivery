import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/create", UserController.create);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);
router.patch("/update/:id", UserController.update);
router.post("/delete/:id", UserController.delete);

export { router as userRoutes };
