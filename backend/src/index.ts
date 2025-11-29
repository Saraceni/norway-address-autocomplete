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
app.get('/search/:query', (req: Request, res: Response, next: NextFunction) => {
    try {
        // URL decode the query parameter to handle special characters like ø, å, æ
        const query = decodeURIComponent(req.params.query);

        // Perform search
        const results = addressSearchService.search(query);

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
app.use((err: Error, _req: Request, res: Response) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Try: http://localhost:${PORT}/search/rod`);
});

