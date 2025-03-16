import { Request, Response, NextFunction } from 'express';

export function preventCrossSiteScripting(req: Request, res: Response, next: NextFunction): void {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    // res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none';");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=()');
    res.setHeader('Expect-CT', 'max-age=86400, enforce');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('Origin-Agent-Cluster', '?1');
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    next();
}

export function restrictLocalAccess(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    // Vérifier certificat auto signé
    if (!req.socket.authorized) return res.status(401).send('Certificat client requis.');

    /*await fetch("url", { // à utiliser plus tard quand on voudra request en local quelque chose
        agent: new https.Agent({
            cert: fs.readFileSync(certFile), // Chemin vers le cert
            key: fs.readFileSync(keyFile), // Chemin vers le key
            rejectUnauthorized: false
        })
    })*/

    const ip = req.ip;

    if (ip === '127.0.0.1' || ip === '::1') {
        if (authHeader && authHeader === `Bearer ${process.env.INTERNAL_API_KEY}`) {
            next(); // Autoriser l'accès à la route
        } else {
            res.sendStatus(403); // Accès interdit
        }
    } else res.sendStatus(403); // Accès interdit
}