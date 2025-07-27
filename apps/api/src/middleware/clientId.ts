import type { Socket } from 'socket.io';

export const attachClientId = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const clientId = socket.handshake.query.clientId as string;

  if (!clientId) {
    console.warn('Socket connection rejected: Missing clientId');
    return next(new Error('clientId is required'));
  }

  socket.data.clientId = clientId;
  next();
};
