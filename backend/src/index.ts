import express, { Request, Response, NextFunction } from 'express';
import { AddressSearchService } from './services/addressSearch';

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize search service
const addressSearchService = new AddressSearchService();

// CORS middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Search endpoint
app.get('/search/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // URL decode the query parameter to handle special characters like ø, å, æ
        const query = decodeURIComponent(req.params.query);

        // Perform search
        const results = addressSearchService.search(query);

        // Delay the result by a random time between 0 and 1000 milliseconds to emulate a real server response time
        const delay = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Return JSON array
        res.json(results);
    } catch (error) {
        next(error);
    }
});

app.get('/monitoring', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Try: http://localhost:${PORT}/search/rod`);
});

