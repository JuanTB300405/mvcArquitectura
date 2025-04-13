import { pool } from '../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cedula, nombre, rol } = req.body;

    if (!cedula || !nombre || !rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
      await pool.query(
        'INSERT INTO persona (cedula, nombre, rol) VALUES (?, ?, ?)',
        [cedula, nombre, rol]
      );
      res.status(201).json({ message: 'Persona registrada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar persona' });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM persona');
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener personas' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
