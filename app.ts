import * as https from 'https';
import * as fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import conventionRoute from "./routes/convention";
import ticketingRoute from "./routes/dashboard/ticketing";
import dashboardRoute from "./routes/dashboard/dashboard";
import apiRoute from "./routes/api";
import { loggerMiddleware, errorHandlerMiddleware } from "./middlewares/logging";
import { preventCrossSiteScripting } from './middlewares/security';

import { auto_render } from './config.json';

import next from 'next';

import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const server = next({ dev: true });
const app = express();

const handle = server.getRequestHandler(); // Handler pour gérer les routes

const options = {
	key: fs.readFileSync("./certificates/key.pem"),
	cert: fs.readFileSync("./certificates/cert.pem"),
	rejectUnauthorized: true, // Permet de vérifier le certificat du serveur à qui mon serveur principal fait la requête à partir des CA que j'ai autorisé
	ca: [
		fs.readFileSync("./certificates/cert.pem", 'utf8')
	]
};

server.prepare().then(() => {

	app.use((req: Request, res: Response, next: NextFunction) => {
		res.header('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
		res.header('Access-Control-Allow-Methods', 'GET,POST'); // Autoriser les méthodes HTTP spécifiées
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Autoriser les en-têtes spécifiés
		res.header('Access-Control-Allow-Credentials', 'true');
		next();
	});

	app.use(errorHandlerMiddleware);

	app.use(bodyParser.json({ limit: "20mb" }));
	app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

	app.use(express.static(path.join(__dirname, "public")));

	app.use(loggerMiddleware);
	app.use(preventCrossSiteScripting);

	// Auto-redirige les utilisateurs déjà autorisés à accéder à cette page dans le middleware d'autorisation juste avant
	app.use(cookieParser());
	
	/*app.use(session({
		secret: String(process.env.SESSION_SECRET),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: true,
			httpOnly: true,
			sameSite: 'strict',
			maxAge: (60 * 60 * 1000),
			signed: true // Empêche la modification
		}
	}));*/
	
	// Contient les sous-router auth, edit account....
	app.use('/api', apiRoute); // L'autorisation est dans les sous routes

	/* Permet de bypass les restrictions sur certains endpoints comme /ticketing/reader 
	(route ticketing a un authenticateJWT global mais vu qu'on veut pouvoir aller sur 
	le reader qui n'est pas présent en route je le positionne ici) */
	
	/*app.use((req, res, next) => {
		const splitter = req.path.split("/");

		if(auto_render.includes(splitter[splitter.length-1])) return server.render(req, res, req.originalUrl);
		next();
	});*/

	// authenticateJWT retiré sur /dashboard à remettre après 
	app.use('/dashboard', authenticateJWT, dashboardRoute);
	app.use('/convention', authenticateJWT, conventionRoute);

	// authentifateJWT retiré le temps de refonte sécu
	app.use('/ticketing', ticketingRoute);

	app.get("/test", async (req: Request, res: Response) => {
		// #discover > Auto-scroll vers catégorie présentation et outil
		// #team > Auto-scroll vers catégorie équipe
		const request = await requestController.find("550e8400-e29b-41d4-a716-446655440000", [ "id", "username", "age" ], Tables.PROFILES);

		return res.status(200).json({ request })
	});

	////// No Prefix, Vitrine //////

	// / = ficher index.tsx par défaut
	app.get("/", (req: Request, res: Response) => {
		// #discover > Auto-scroll vers catégorie présentation et outil
		// #team > Auto-scroll vers catégorie équipe

		return server.render(req, res, '/');
	});

	// Pas besoin d'auto render, si y a pas de route, cet élément est capable de le gérer
	app.all("*", (req: Request, res: Response) => { // Permet de gérer les chemin de récup des build et de les afficher
		return handle(req, res);
	});

	////// No Prefix, Vitrine //////
});

const PORT = process.env.PORT;

import './middlewares/databasePool';
import requestController from './utility/requestController';
import { Tables } from './utility/DataType';
import { authenticateJWT } from './middlewares/auth';

https.createServer(options, app).listen(PORT, async () => {
	console.log(`Server is running on https://localhost:${PORT}`);

	/*const response = await axios.get("https://127.0.0.1:47050/ticketing/generate/1", {
		httpsAgent: new https.Agent({
			cert: fs.readFileSync("./certificates/cert.pem"),
			key: fs.readFileSync("./certificates/key.pem"),
			rejectUnauthorized: false
		}),
		headers: {
			'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
		}
	})

	if(response) console.log(response.status + response.statusText)*/
});

export default server;