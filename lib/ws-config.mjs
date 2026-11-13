// Enable obs-websocket with a random local password. Never prints the password.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cfgPath = process.argv[2];
if (!cfgPath) { console.error('usage: ws-config.mjs <obs-websocket config.json>'); process.exit(2); }

let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8')); } catch { cfg = {}; }
const hadPassword = typeof cfg.server_password === 'string' && cfg.server_password.length > 0;

cfg.alerts_enabled = false;
cfg.auth_required = true;
cfg.first_load = false;
cfg.server_enabled = true;
cfg.server_port = Number(cfg.server_port || 4455);
if (!hadPassword) cfg.server_password = crypto.randomBytes(18).toString('base64url');

fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n', { mode: 0o600 });
fs.chmodSync(cfgPath, 0o600);
console.log(hadPassword ? 'WS_CONFIG_KEPT (existing password preserved)' : 'WS_CONFIG_CREATED (random password stored in config.json)');
console.log('WS_PORT ' + cfg.server_port);
