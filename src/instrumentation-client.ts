import { initBotId } from 'botid/client/core';

// Invisible bot protection (Vercel BotID) for the contact form endpoint.
initBotId({
  protect: [{ path: '/api/contact', method: 'POST' }],
});
