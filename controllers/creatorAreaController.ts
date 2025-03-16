import { Request, Response } from 'express';
import server from '../app';

const creatorAreaController = {

    display: async (req: Request, res: Response): Promise<void> => {
  
        try {


            return server.render(req, res, '/creator_area');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error' });
        }
    }
}

export default creatorAreaController;