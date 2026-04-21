const cron = require('node-cron');
const drawService = require('./draw.service');

// Runs every month (1st day at midnight)
cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly draw...');

  const month = new Date().toISOString().slice(0, 7);

  const draw = await drawService.createDraw(month);
  await drawService.runDraw(draw.id);
  await drawService.publishDraw(draw.id);

  console.log('Draw completed');
});