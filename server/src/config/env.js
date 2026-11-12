require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
module.exports = { port: Number(process.env.PORT || 3000), origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200' };
