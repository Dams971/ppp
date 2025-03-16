import { Router } from 'express'
import conventionController from '../controllers/conventionController';

const router = Router();

// router.post('/create', ticketController.createLicence);
// router.get('/', ()); // Voir si la méthode POST ne serait pas plus appropriée / voir si on peut mettre une authorization dans un GET
router.get('/profile'); // Convention Account

// Pourquoi c'est accessible aussi de /dashboard/myticket alors que c'est que de /convention normalement ?
router.get('/registration', (req, res) => conventionController.displayTicket(req, res, "display"));
router.get('/friends-group');
router.get('/attendees');
router.get('/schedule');
router.get('/conbook');
router.get('/dealers-den');
router.get('/menu');
router.get('/map');
router.get('/staff');

router.get('/emergency');

export default router;