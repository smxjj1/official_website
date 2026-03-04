export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'Text/Plain');
  return 'pong';
});
