import app from './app.js';
import {DB_URI, PORT} from './config/env.js';

app.listen(PORT, () => {
    console.log(
        `Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
    console.log(`Connected to database: ${DB_URI ? 'Yes' : 'No'}`); // Check if DB_URI is loaded
    console.log(`CORS enabled for: ${process.env.FRONTEND_URL}`);
});
