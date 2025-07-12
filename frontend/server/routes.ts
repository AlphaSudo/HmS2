import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Proxy route for stroke assessment to handle CORS
  app.post('/api/patients/stroke-assessment', async (req, res) => {
    try {
      console.log('Proxy: Received request for stroke assessment');
      console.log('Proxy: Request body:', req.body);

      const response = await fetch('http://localhost:8080/patients/stroke-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });

      console.log('Proxy: Backend response status:', response.status);
      console.log('Proxy: Backend response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Proxy: Backend response text:', responseText.substring(0, 200) + '...');

      if (!response.ok) {
        console.error('Proxy: Backend returned non-OK status:', response.status);
        return res.status(response.status).json({ 
          error: `Backend responded with ${response.status}`,
          details: responseText
        });
      }

      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText);
        res.json(data);
      } catch (parseError) {
        console.error('Proxy: Failed to parse backend response as JSON:', parseError);
        res.status(500).json({ 
          error: 'Backend returned invalid JSON',
          details: responseText.substring(0, 500)
        });
      }
    } catch (error) {
      console.error('Proxy: Request failed:', error);
      res.status(500).json({ 
        error: 'Failed to proxy request to backend',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
