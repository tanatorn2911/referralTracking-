// pages/api/login/post.js
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import bodyParser from 'body-parser';


const jsonParser = bodyParser.json();

export async function POST(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
 
    let passedValue = await new Response(req.body).text();
    console.log('passedValue',passedValue)
    let bodyreq = JSON.parse(passedValue);
    const { username,password } = bodyreq;


    // Connect to PostgreSQL database
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'loginAdmin',
      password: '123456',
      port: 5432,
    });

    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

      client.release();

      if (result.rows.length === 1) {
        // Login successful
        // res.status(200).json({ message: 'Login successful' });
        return new Response('Login successfully',{status:200})
      } else {
        // Invalid username or password
        // res.status(401).json({ message: 'Invalid username or password' });
        return new Response('Invalid username or password',{status:401})

      }
    } catch (error) {
      console.error('Error executing query', error);
      // res.status(500).json({ message: 'Internal server error' });
      return new Response('Invalid username or password',{status:500})

    }
  } else {
    // res.status(405).end(); // Method Not Allowed
    return new Response('Invalid usernsword',{status:405})

  }
}
