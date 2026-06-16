import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import schoolInfoRouter from "./schoolInfo";
import staffRouter from "./staff";
import studentsRouter from "./students";
import topStudentsRouter from "./topStudents";
import noticesRouter from "./notices";
import galleryRouter from "./gallery";
import casteStatsRouter from "./casteStats";
import contactRouter from "./contact";
import dashboardRouter from "./dashboard";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(schoolInfoRouter);
router.use(staffRouter);
router.use(studentsRouter);
router.use(topStudentsRouter);
router.use(noticesRouter);
router.use(galleryRouter);
router.use(casteStatsRouter);
router.use(contactRouter);
router.use(dashboardRouter);
router.use(uploadRouter);

export default router;
