const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const http = require('http');
const url = require('url');

require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const PORT = 3001;
let server;

async function authorize() {
  // Usar urn:ietf:wg:oauth:2.0:oob para aplicaciones de escritorio
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `http://localhost:${PORT}/oauth2callback`
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'select_account', // Fuerza a que muestres el selector de cuentas
  });

  console.log('\n═════════════════════════════════════════════════════════');
  console.log('📱 ABRE ESTE ENLACE EN TU NAVEGADOR:');
  console.log('═════════════════════════════════════════════════════════');
  console.log(authUrl);
  console.log('═════════════════════════════════════════════════════════\n');

  // Crear servidor para recibir callback
  server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/oauth2callback') {
      const code = parsedUrl.query.code;
      const error = parsedUrl.query.error;

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Error: ${error}`);
        console.error('❌ Error de autorización:', error);
        process.exit(1);
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>✓ Autorización completada</h1><p>Puedes cerrar esta ventana y regresa a la terminal.</p>');

        try {
          const { tokens } = await oauth2Client.getToken(code);
          const tokenPath = path.join(process.cwd(), 'tokens.json');
          fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
          console.log('\n✓ ¡Tokens guardados correctamente en tokens.json!');
          console.log('✓ Ya puedes cerrar el navegador y reiniciar tu aplicación.');
          server.close();
          process.exit(0);
        } catch (error) {
          console.error('❌ Error obteniendo tokens:', error.message);
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Error: ${error.message}`);
          server.close();
          process.exit(1);
        }
      } else {
        res.writeHead(400);
        res.end('No se recibió código de autorización');
        process.exit(1);
      }
    } else {
      res.writeHead(404);
      res.end('No encontrado');
    }
  });

  server.listen(PORT, () => {
    console.log(`⏳ Servidor esperando autorización en http://localhost:${PORT}/oauth2callback\n`);
  });
}

authorize().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
