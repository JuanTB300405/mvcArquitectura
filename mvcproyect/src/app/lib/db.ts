import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'turntable.proxy.rlwy.net',
  user: 'root',
  password: 'cVgHItGyCyNMnONGbAxFadpVvgaxacsp',
  database: 'railway',
  port: 17170,
});


