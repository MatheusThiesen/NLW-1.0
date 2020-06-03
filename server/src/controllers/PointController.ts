import { Request, Response} from 'express';
import db from '../database';

class PointController {
  async create (req: Request, res: Response) {
    const { 
      name,
      email,
      whatsapp,
      latitude, 
      longitude, 
      city, 
      uf,
      items
    } = req.body;
  
    const point = {
      image: 'https://www.fusesc.com.br/wp-content/uploads/2017/02/seudinheiro-Lista-de-compra-de-supermercado-635x423.jpg',
      name,
      email,
      whatsapp,
      latitude, 
      longitude, 
      city, 
      uf
    }
  
    const trx = await db.transaction();
  
    const insertIds = await trx('points').insert(point);
    const point_id = insertIds[0];
  
    const pointItems = items.map((item_id: Number ) => ({
      item_id,
      point_id
    }))
  
    await trx('point_items').insert(pointItems)
    await trx.commit()
  
    res.json({
      point_id,
      ...point
    });
  }

  async show (req: Request, res: Response) {
    const {id} = req.params;

    const point = await db('points').where('id', id).first()

    if(!point)
      return res.status(400).json({error: 'Point not found.'});
    
    const items = await db('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return res.json({point, items});
  }

  async index (req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parasedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await db('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parasedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    return res.json(points)
  }

}

export default PointController;