import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import requestController from '../utility/requestController';
import { Accounts, Tables } from '../utility/DataType';
import jwt_caching from '../utility/caching/jwt_logout.json';
import { randomUUID } from 'crypto';
import fs from 'fs';

import { redirect } from 'next/navigation'

interface JwtCaching {
    blacklist: string[];
};

const privateKey = fs.readFileSync("./certificates/JWT/private_key.pem");

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

const authController = {

    login: async (req: Request, res: Response): Promise<any> => {

        try {
            const { email, password } = req.body;

            if (!isValidEmail(email)) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

            const userData: Accounts = await requestController.find(email, ["id", "username", "irlEvent", "password"], Tables.ACCOUNTS, "email");

            if (!userData) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

            const match = await bcrypt.compare(password, userData.password);

            if (!match) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

            // Faire en sorte de mettre une expiration à 1h et le rafraichir à chaque passage quand l'expiration est inférieure à 30 min
            const token = jwt.sign({ id: userData.id }, privateKey, { expiresIn: '2d', algorithm: 'ES512' });

            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 86400000 }); // domain: "furagora.seven-souls.fr"
            
            // Gérer moi même les sessions en stockant en cache local et mémoire (au démarrage) les sessions utilisateur et faire mon propre middleware
            //return res.status(302).send()//.json({ username: userData.username, irlEvent: userData.irlEvent });
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Error when login user' });
        }
    },

    logout: async (req: Request, res: Response): Promise<any> => { // faire une page permettant de close toutes les sessions auxiliaires
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(400).json({ message: 'Aucun token fourni.' });
        
        (jwt_caching as JwtCaching).blacklist.push(token);

        res.clearCookie('token', { httpOnly: true, secure: true, maxAge: 86400000 });
        res.status(200).json({ message: 'Déconnexion réussie.' });

        fs.writeFileSync("./utility/caching/jwt_logout.json", JSON.stringify(jwt_caching, null, 4));
    },

    register: async (req: Request, res: Response): Promise<any> => {

        try {
            // Si JWT OK rediriger vers dashboard
            const { username, email, password } = req.body;

            const userData = await requestController.find(email, ["id"], Tables.ACCOUNTS, "email"); // Remplacer par une requête au cache local

            if (userData) return res.status(200).json({ message: "User Already Exist" });

            const hashedPassword = await bcrypt.hash(password, 14);

            const userObject: Partial<Accounts> = {
                id: String(randomUUID({ disableEntropyCache: true })),
                username: String(username),
                email: String(email),
                password: String(hashedPassword),
                createdAt: Date.now()
            };

            requestController.insert(userObject, Tables.ACCOUNTS) // à décommenter quand j'aurais finit les tests

            const token = jwt.sign({ id: userObject.id }, privateKey, { expiresIn: '2d', algorithm: 'ES512' }); // 1 heure d'expiration

            // Champ secure à mettre en "true" lorsque nous serons en https
            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 86400000 }); // domain: "furagora.seven-souls.fr" // 2 jours avant expiration, voir pour faire un cookie qui dure que 24h et si il ajoute un remember me, faire un cookie de 1 mois max
            res.status(201).send()
            //return res.redirect("/dashboard/");
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: 'Error when login user' });
        }
    }

}

export default authController;