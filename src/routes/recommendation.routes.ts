import { Router } from "express";
import { RecommendationController } from "../controllers/recommendation.controller";

const recommendationRoutes = Router();

recommendationRoutes.get("/user/:userId", (req, res) =>
  RecommendationController.getSuggestions(req, res)
);

export default recommendationRoutes;
