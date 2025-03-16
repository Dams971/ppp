import { Request, Response } from 'express';
import server from '../app';
import requestController from '../utility/requestController';
import { Accounts, Tables } from '../utility/DataType';
import utilityController from '../utility/utilityFunction';

const dashboardController = {

    displayHome: async (req: Request, res: Response): Promise<void> => {
  
        try {

            console.log("Dashboard Render")
            /*console.log(req.session)
            console.log(req.session.token)*/
            
            const userData: Accounts = await requestController.find(utilityController.getUuidFromToken(req.cookies.token), ["username", "irlEvent"], Tables.ACCOUNTS);
            console.log(userData)
            console.log(Object(userData))
            return server.render(req, res, '/dashboard', Object(userData));
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error' });
        }
    },

    displayAccount: async (req: Request, res: Response): Promise<void> => {

        try {


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error' });
        }
    },
}

export default dashboardController;