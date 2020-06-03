import { Router } from 'express';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = Router()

const itemController = new ItemController;
const pointController = new PointController;

routes.get('/items', itemController.index);

routes.get('/points', pointController.index);
routes.post('/points', pointController.create);
routes.get('/points/:id', pointController.show);

export default routes;



// const users = [
//   {
//     name: "Matheus"
//   },
//   {
//     name: "Lennon"
//   },
//   {
//     name: "Jorger"
//   },
// ]
// routes.get('/users', (req: Request, res: Response) => {
//   const search = String(req.query.search);
//   const filteredUsers = search ? users.filter(user => user.name.includes(search)) : users;

//   res.json(filteredUsers)  
// })