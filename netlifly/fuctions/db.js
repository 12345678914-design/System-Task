import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Obtener la URL de la base de datos desde las variables de entorno
  const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { query, params } = await req.json();
    
    // Ejecutar la consulta
    const result = await sql(query, params);
    
    return new Response(JSON.stringify({ rows: result }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/.netlify/functions/db'
};
