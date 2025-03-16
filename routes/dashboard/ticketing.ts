import { Router } from 'express'

import conventionController from '../../controllers/conventionController'
import { restrictLocalAccess } from '../../middlewares/security';

const router = Router();

router.get('/verify/:code', conventionController.checkTicket); // Voir si la méthode POST ne serait pas plus appropriée / voir si on peut mettre une authorization dans un GET

// RestrictLocalAccess sur cette route en PROD
router.post('/generate/:uuid', (req, res) => conventionController.displayTicket(req, res, "generate"));

export default router;