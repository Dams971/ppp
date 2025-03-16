import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import server from '../app';
import { Tables, Ticket } from '../utility/DataType';
import utilityController from '../utility/utilityFunction';
import axios from 'axios';
import requestController from '../utility/requestController';

/*async function generate2DDoc(userId: any): Promise<string> {

    const token = jwt.sign(userId, fs.readFileSync('./certificates/2D_Code_Keys/private_key.pem', 'utf8'), { algorithm: 'ES512' });

    const qrCodeDataUrl = await QRCode.toDataURL(token, {
        version: 13,  // La version correspondant à la capacité du QR Code
        errorCorrectionLevel: 'H', // Niveau d'erreur de correction
        type: 'image/png',
        width: 300,     // Largeur du QR Code
        margin: 1,     // Marge
        color: {
            dark: '#000000', // Couleur du QRCode
            light: '#ffffff' // Couleur de fond
        }
    });

    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext('2d');

    const qrCodeImg = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrCodeImg, 0, 0, 300, 300);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const logoSize = 100; // Taille du logo
    const borderSize = 6; // Taille du contour blanc

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, (logoSize - borderSize) / 2, 0, Math.PI * 2);
    ctx.fill();

    const logo = await loadImage('./public/img/logo_gold.png');

    ctx.drawImage(logo, 100, 100, logoSize, logoSize);

    // return canvas.toDataURL();

    return token;
}*/

const conventionController = {

    // type = generate / display
    displayRegistrationPage: async (req: Request, res: Response): Promise<any> => {
        let uuid;

        try {
            uuid = utilityController.getUuidFromToken(req.cookies.token)

            const isExist: Ticket = await requestController.find(uuid, ["*"], Tables.PROFILES);

            if(!isExist) return res.status(404).json({ message: "Profile not found"})

            const accountData = JSON.parse(JSON.stringify(isExist));

            return server.render(req, res, "/convention/registration", { account: accountData })
        }catch(error){
            console.error(error);
            res.status(200).json({ message: 'Error displaying registration' });
        }
    },

    displayTicket: async (req: Request, res: Response, type: string): Promise<any> => {
        let code;
        let uuid;

        try {
            uuid = utilityController.getUuidFromToken(req.cookies.token)

            if(!uuid) return res.status(401).json({ message: "Vous n'êtes pas connecté" })

            const isExist: Ticket = await requestController.find(uuid, ["code"], Tables.TICKETS);

            switch (type) {
                case "generate":
                    if (isExist && typeof isExist !== 'boolean') return res.status(200).json({ message: "Vous possédez déjà un ticket" });

                    code = jwt.sign(uuid, fs.readFileSync('./certificates/2D_Code_Keys/private_key.pem', 'utf8'), { algorithm: 'ES512' });

                    const ticketData: Ticket = req.body

                    // Ajouter code à ticketData avant INSERT

                    requestController.insert(ticketData, Tables.TICKETS);
                    break;

                case "display":
                    if (isExist && typeof isExist !== 'boolean') code = isExist.code
                    else return res.status(404).json({ message: "No ticket found" })
                    break;
            }

            console.log(code)

            // Ce n'est pas /convention/myticket car ici on se base sur le chemin et non pas l'URL
            return server.render(req, res, "/dashboard/myticket", { code: code }) // Ici, rediriger le contenu sur la page de ticket du mec
        } catch (error) {
            console.error(error);
            res.status(200).json({ message: 'Error generating ticket' });
        }
    },

    checkTicket: async (req: Request, res: Response): Promise<any> => {
        const { code } = req.params;

        try {
            // Certificats manquants, ils sont passés où ?
            const pubKey = fs.readFileSync('./certificates/2D_Code_Keys/public_key.pem', 'utf8')

            const uuid = jwt.verify(code, pubKey);

            // Reformater l'objet avant envoie pour ne pas envoyer au contrôleur d'infos sensibles
            const ticket: Ticket | boolean = await requestController.find(String(uuid), ["*"], Tables.TICKETS);

            if (!ticket || typeof ticket === 'boolean') return res.status(200).json({ message: "Ticket invalide, signalez-le immédiatement aux organisateurs." })

            if (ticket.status === 3) return conventionController.validateTicket(ticket, res, true);
            if (ticket.status === 1) return res.status(200).json({ message: "Ticket non payé, fraude détectée, signalez-le immédiatement aux organisateurs." });

            if (ticket) conventionController.validateTicket(ticket, res, false)
            else res.status(200).json({ message: "Ticket invalide, signalez-le immédiatement aux organisateurs." })

        } catch (error) {
            console.error(error);
            res.status(200).json({ message: 'Error checking ticket' });
        }
    },

    validateTicket: async (ticket: Ticket, res: Response, duplicata: boolean): Promise<any> => {

        try {
            const conventionProfile: Ticket | boolean = await requestController.find(String(ticket.id), ["status", "username", "firstname", "lastname", "age", "birthdate", "species", "companyName", "countryId", "priority"], Tables.PROFILES);
            
            if (!conventionProfile || typeof conventionProfile === 'boolean') return res.status(200).json({ message: "Ticket invalide, signalez-le immédiatement aux organisateurs." })

            const reformatedData = {
                status: ((ticket.status === 3 && ((Date.now() - ticket.validation_date) > 60 * 1000)) ? `Ticket déjà validé à ${utilityController.timestampToDate(ticket.validation_date, false, true)}\n<b>Si l'heure de validation date à maintenant, vous pouvez laisser passer l'utilisateur, vous avez juste scanné 2 fois son QR Code sans faire exprès.\nSi l'heure de validation a déjà quelques minutes d'écart avec l'heure actuelle, mettez la personne de côté et appelez un organisateur.</b>` : ticket.status === 1 ? "Ticket non payé, fraude détectée, signalez-le immédiatement aux organisateurs." : "Ticket validé"),
                ticket_level: utilityController.ticketLevelToText(ticket.ticket_level),
                validation_date: ticket.validation_date,
                username: conventionProfile.username,
                account_status: conventionProfile.status,
                firstname: conventionProfile.firstname,
                lastname: conventionProfile.lastname,
                age: conventionProfile.age,
                birthdate: conventionProfile.birthdate,
                species: conventionProfile.species,
                companyName: conventionProfile.companyName,
                countryId: conventionProfile.countryId,
                priority: conventionProfile.priority
            }

            if (duplicata) return res.status(201).json(reformatedData);

            ticket.status = 3
            ticket.validation_date = Date.now()

            const ticketUpdate = await requestController.updateByUuid(ticket.id, ticket, Tables.TICKETS);

            if (ticketUpdate) res.status(201).json(reformatedData);
            else res.status(200).json({ message: "Ticket valide mais erreur de mise à jour survenue, laissez passer l'utilisateur", reformatedData });

            axios.post('https://furagora.seven-souls.fr/convention/new-scan', reformatedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error(error);
            res.status(200).json({ message: "Ticket valide mais erreur de mise à jour survenue, laissez passer l'utilisateur" })
        }
    }
}

export default conventionController;