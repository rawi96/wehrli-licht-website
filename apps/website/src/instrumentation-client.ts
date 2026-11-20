import { initBotId } from 'botid/client/core';

// Invisible bot protection (Vercel BotID) for the contact form endpoint.
// Runs on every page load (also covers forms reached via client-side navigation);
// the challenge script itself is only fetched when /api/contact is called.
initBotId({
  protect: [{ path: '/api/contact', method: 'POST' }],
});
