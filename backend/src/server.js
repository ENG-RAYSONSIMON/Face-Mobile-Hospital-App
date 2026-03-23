require('dotenv').config();

const app = require('./app');
const { checkDatabaseConnection } = require('./config/db');

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await checkDatabaseConnection();
    console.log('Database connection established.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
