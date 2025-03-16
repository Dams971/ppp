import { Router } from 'express'

import dashboardController from '../../controllers/dashboardController'

const router = Router();

// Basique 
router.get('/', dashboardController.displayHome); // Voir si la méthode POST ne serait pas plus appropriée / voir si on peut mettre une authorization dans un GET
router.get('/account', dashboardController.displayAccount); // My Account

// Partner
router.get('/partner/furrcard');
router.get('/partner/awtter');

////// Creator Mode //////
// Activation mode créateur (méthode POST)
router.post('/creator/');

// Nécessite que le mode créateur soit activé
router.get('/creator/pricelist');
router.get('/creator/order');
router.get('/creator/tickets');
router.get('/creator/notifications');

////// Streamer Mode //////
// Activation mode streameur (méthode POST)
router.post('/streamer/');
router.get('/streamer/commands');
router.get('/streamer/rewards');
router.get('/streamer/animations');
router.get('/streamer/remote-control');

export default router;