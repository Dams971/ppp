import { Router } from 'express'
import authController from '../controllers/authController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// Route /api/auth/ >>
router.post('/login', authController.login);
router.post('/logout', authenticateJWT, authController.logout);
router.post('/register', authController.register);

// JWT Refresh
router.post('/refresh', authenticateJWT);

// JWT Verify
router.get('/verify', authenticateJWT);

export default router;