import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Proxy route for stroke assessment to handle CORS
  app.post('/api/patients/stroke-assessment', async (req, res) => {
    console.log('=== STROKE ASSESSMENT PROXY START ===');
    console.log('Proxy: Received request for stroke assessment');
    console.log('Proxy: Request body:', req.body);
    console.log('Proxy: Request headers:', req.headers);

    try {
      // Try patient management service via API gateway first
      console.log('Proxy: Step 1 - Attempting connection via patient management service...');
      try {
        const response = await fetch('http://localhost:8080/patients/stroke-assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body)
        });

        console.log('Proxy: Patient service response status:', response.status);

        if (response.ok) {
          console.log('Proxy: Patient service connection successful');
          const responseText = await response.text();
          console.log('Proxy: Patient service response text:', responseText.substring(0, 200) + '...');

          try {
            const data = JSON.parse(responseText);
            console.log('Proxy: Returning patient service response');
            return res.json(data);
          } catch (parseError) {
            console.error('Proxy: Failed to parse patient service response as JSON:', parseError);
            return res.status(500).json({ 
              error: 'Patient service returned invalid JSON',
              details: responseText.substring(0, 500)
            });
          }
        } else {
          console.log('Proxy: Patient service failed with status:', response.status);
          const errorText = await response.text();
          console.log('Proxy: Patient service error response:', errorText.substring(0, 200));
        }
      } catch (patientError) {
        console.log('Proxy: Patient service connection error:', patientError instanceof Error ? patientError.message : 'Unknown error');
        console.log('Proxy: Error type:', patientError instanceof Error ? patientError.constructor.name : typeof patientError);
      }

      // Fallback to direct connection to stroke prediction service
      console.log('Proxy: Step 2 - Attempting direct connection to stroke prediction service...');
      console.log('Proxy: Target URL: http://127.0.0.1:9000/stroke-prediction/predict');
      
      try {
        const directResponse = await fetch('http://127.0.0.1:9000/stroke-prediction/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body)
        });

        console.log('Proxy: Direct service response status:', directResponse.status);
        console.log('Proxy: Direct service response headers:', Object.fromEntries(directResponse.headers.entries()));

        const directResponseText = await directResponse.text();
        console.log('Proxy: Direct service response text:', directResponseText.substring(0, 200) + '...');

        if (!directResponse.ok) {
          console.error('Proxy: Direct service returned non-OK status:', directResponse.status);
          console.error('Proxy: Direct service error details:', directResponseText);
          return res.status(directResponse.status).json({ 
            error: `Direct service responded with ${directResponse.status}`,
            details: directResponseText
          });
        }

        // Try to parse as JSON
        try {
          const data = JSON.parse(directResponseText);
          console.log('Proxy: Successfully parsed direct service response');
          console.log('Proxy: Returning direct service response');
          res.json(data);
        } catch (parseError) {
          console.error('Proxy: Failed to parse direct service response as JSON:', parseError);
          res.status(500).json({ 
            error: 'Direct service returned invalid JSON',
            details: directResponseText.substring(0, 500)
          });
        }
      } catch (directError) {
        console.error('Proxy: Direct service connection error:', directError instanceof Error ? directError.message : 'Unknown error');
        console.error('Proxy: Direct error type:', directError instanceof Error ? directError.constructor.name : typeof directError);
        throw directError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('Proxy: All connection attempts failed:', error);
      console.error('Proxy: Final error type:', error instanceof Error ? error.constructor.name : typeof error);
      res.status(500).json({ 
        error: 'Failed to connect to stroke prediction service via all available routes',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    console.log('=== STROKE ASSESSMENT PROXY END ===');
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
