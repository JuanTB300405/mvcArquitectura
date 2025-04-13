import { pool } from '../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, titulo, cantidad_total } = req.body;
    try {
      await pool.query(
        'INSERT INTO material (id, titulo, cantidad_total, cantidad_actual) VALUES (?, ?, ?, ?)',
        [id, titulo, cantidad_total, cantidad_total]
      );
      res.status(201).json({ message: 'Material registrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al registrar material' });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM material');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener materiales' });
    }
  }
}


