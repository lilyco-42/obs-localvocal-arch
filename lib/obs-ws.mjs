// Minimal obs-websocket 5 client using Node's built-in WebSocket (Node >= 22).
import crypto from 'node:crypto';

export async function connect(password, port = 4455, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://127.0.0.1:' + port, 'obswebsocket.json');
    let nextId = 1;
    let identified = false;
    let settled = false;
    const pending = new Map();
    const readyWaiters = [];
    const timer = setTimeout(() => {
      if (!identified && !settled) { settled = true; reject(new Error('WS_TIMEOUT')); try { ws.close(); } catch {} }
    }, timeoutMs);

    const fail = (err) => {
      if (!settled) { settled = true; clearTimeout(timer); reject(err); }
      for (const p of pending.values()) p({ requestStatus: { code: 500, comment: String(err) } });
      pending.clear();
    };

    ws.onmessage = (ev) => {
      let m;
      try { m = JSON.parse(ev.data); } catch { return; }
      if (m.op === 0) {
        const auth = m.d && m.d.authentication;
        const ident = { op: 1, d: { rpcVersion: 1, eventSubscriptions: 0 } };
        if (auth) {
          const secret = crypto.createHash('sha256').update((password || '') + auth.salt).digest('base64');
          ident.d.authentication = crypto.createHash('sha256').update(secret + auth.challenge).digest('base64');
        }
        ws.send(JSON.stringify(ident));
      } else if (m.op === 2) {
        identified = true;
        clearTimeout(timer);
        readyWaiters.splice(0).forEach((fn) => fn());
      } else if (m.op === 7) {
        const p = pending.get(m.d.requestId);
        if (p) { pending.delete(m.d.requestId); p(m.d); }
      }
    };
    ws.onerror = (e) => fail(new Error('WS_ERROR ' + ((e && e.message) || 'unknown')));
    ws.onclose = () => { if (!identified) fail(new Error('WS_CLOSED before Identified')); };

    const waitReady = () => identified ? Promise.resolve() : new Promise((r) => readyWaiters.push(r));
    const req = async (requestType, requestData = {}) => {
      await waitReady();
      const requestId = 'r' + (nextId++);
      return await new Promise((res) => {
        pending.set(requestId, res);
        ws.send(JSON.stringify({ op: 6, d: { requestType, requestId, requestData } }));
      });
    };
    waitReady().then(() => { if (!settled) { settled = true; resolve({ req, close: () => ws.close() }); } });
  });
}
