// Custom Artillery steps that measure real server round-trips for talk rooms.
// The server never acks emits, but it broadcasts `message` and the
// "joined the room" `system_message` back to the sender's room, so we time
// how long it takes for our own event to come back.

const TIMEOUT_MS = 10000;

function getSocket(context) {
  return context.sockets && context.sockets[''];
}

function waitFor(socket, channel, predicate, onDone) {
  let finished = false;

  const handler = (payload) => {
    if (finished || !predicate(payload)) return;
    finish(true);
  };

  const timer = setTimeout(() => finish(false), TIMEOUT_MS);

  function finish(ok) {
    finished = true;
    clearTimeout(timer);
    socket.off(channel, handler);
    onDone(ok);
  }

  socket.on(channel, handler);
}

function joinRoom(context, events, done) {
  const socket = getSocket(context);
  if (!socket) return done(new Error('socket not connected'));

  const username = `lt-${Math.random().toString(36).slice(2, 10)}`;
  context.vars.username = username;

  const startedAt = Date.now();
  waitFor(
    socket,
    'system_message',
    (msg) => msg && msg.text === `${username} joined the room`,
    (ok) => {
      if (ok) {
        events.emit('histogram', 'talkroom.join_rtt', Date.now() - startedAt);
      } else {
        events.emit('counter', 'talkroom.join_timeout', 1);
      }
      done();
    }
  );

  socket.emit('join_room', {
    username,
    room: context.vars.room,
    feeling: context.vars.feeling,
  });
}

function sendMessage(context, events, done) {
  const socket = getSocket(context);
  if (!socket) return done(new Error('socket not connected'));

  const id = `${context.vars.username}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const text = `hello from artillery ${id}`;

  const startedAt = Date.now();
  waitFor(
    socket,
    'message',
    (msg) => msg && msg.text === text,
    (ok) => {
      if (ok) {
        events.emit('histogram', 'talkroom.message_rtt', Date.now() - startedAt);
      } else {
        events.emit('counter', 'talkroom.message_timeout', 1);
      }
      done();
    }
  );

  socket.emit('message', {
    user: context.vars.username,
    text,
    room: context.vars.room,
    feeling: context.vars.feeling,
  });
}

module.exports = { joinRoom, sendMessage };
