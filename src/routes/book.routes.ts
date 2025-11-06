import { Router } from "express";
import { BookController } from "../controllers/book.controller";

const bookRoutes = Router();
const controller = new BookController();

bookRoutes.get("/search", (req, res) => controller.search(req, res));
bookRoutes.post("/", (req, res) => controller.addBook(req, res));
bookRoutes.patch("/status", (req, res) => controller.updateStatus(req, res));
bookRoutes.patch("/favorite", (req, res) => controller.toggleFavorite(req, res));
bookRoutes.get("/user/:userId", (req, res) => controller.listUserBooks(req, res));
bookRoutes.delete("/books", (req, res) => controller.removeBookFromUser(req, res));


export default bookRoutes;
