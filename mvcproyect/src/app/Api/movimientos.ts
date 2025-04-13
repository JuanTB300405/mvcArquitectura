import { pool } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tipo, material_id, persona_cedula } = req.body;

    if (!['PRESTAMO', 'DEVOLUCION'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de movimiento inválido' });
    }

    try {
      const id = uuidv4();

      // Actualizar inventario
      const ajuste = tipo === 'PRESTAMO' ? -1 : 1;
      const [result] = await pool.query(
        `UPDATE material SET cantidad_actual = cantidad_actual + ? WHERE id = ? AND (cantidad_actual + ?) >= 0`,
        [ajuste, material_id, ajuste]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(400).json({ error: 'Inventario insuficiente o material no encontrado' });
      }

      // Insertar movimiento
      await pool.query(
        `INSERT INTO movimiento (id, tipo, material_id, persona_cedula) VALUES (?, ?, ?, ?)`,
        [id, tipo, material_id, persona_cedula]
      );

      res.status(201).json({ message: 'Movimiento registrado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al registrar movimiento' });
    }

  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
