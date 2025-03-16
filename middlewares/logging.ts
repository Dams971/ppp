import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
	console.log(`${req.method} request made to ${req.path}`);
	next();
}

export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
	console.error(err);
	res.status(500).send('Something went wrong');
}