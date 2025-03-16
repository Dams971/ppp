import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const isBlacklisted = (token: string): boolean => {
	const blacklist = fs.readFileSync("./utility/caching/jwt_logout.json", 'utf-8');
	return blacklist.includes(token);
};

export function staffAuth(req: Request, res: Response, next: NextFunction) {

	next();
}

export function authenticateJWT(req: any, res: Response, next: NextFunction) {
	const token = req.cookies.token
	const localToken = req.headers['authorization']?.split(' ')[1]; // Gérer via une liste comme auto_render mais là ça sera une liste de liens qui ne prennent QUE ce genre de tokens
	// authorization token non géré, authorization certificat non géré 
	if (!token) return res.redirect("/login"); // Forbidden

	if (isBlacklisted(token)) return res.redirect("/login"); // Token invalide | expiré

	jwt.verify(token, fs.readFileSync("./certificates/JWT/public_key.pem"), (err: any, data: any) => {
		if (err) return res.redirect("/login"); // Forbidden
		req.user = data; // C'est vraiment utile vu qu'on l'a dans req.cookies ?
		next();
	});
}
