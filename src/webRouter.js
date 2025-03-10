import { Router } from 'express';
import usersRoutes from './web/routes/usersRoutes';

const router = Router();

router.use('/c/users', usersRoutes);


export default router;
