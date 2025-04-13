import { pool } from '../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [movimientos] = await pool.query(`
        SELECT 
          m.id,
          m.tipo,
          m.fecha,
          mat.titulo AS material,
          per.nombre AS persona,
          per.rol
        FROM movimiento m
        JOIN material mat ON m.material_id = mat.id
        JOIN persona per ON m.persona_cedula = per.cedula
        ORDER BY m.fecha DESC
      `);

      res.status(200).json(movimientos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener historial de movimientos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
