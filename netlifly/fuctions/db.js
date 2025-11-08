import { neon } from '@netlify/neon';

export default async (req, context) => {
  // Inicializar conexión a la base de datos
  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { query, params } = await req.json();
    
    // Ejecutar consulta
    const result = await sql(query, params);
    
    return new Response(JSON.stringify({ rows: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/db'
};
