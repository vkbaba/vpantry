const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_FILE = path.join(__dirname, '..', 'metrics.log');
const STATE_FILE = path.join(__dirname, '..', '.metrics-state.json');

// state ファイルの読み書き
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const eventType = process.argv[2];
  let hookData = {};
  try {
    hookData = input ? JSON.parse(input) : {};
  } catch (e) {
    hookData = {};
  }

  const now = Date.now();
  const sessionId = hookData.session_id || 'unknown';
  let duration_ms = null;
  const state = loadState();

  // prompt_submit 時: 開始時刻を保存
  if (eventType === 'prompt_submit') {
    state[sessionId] = { prompt_submit_at: now };
    saveState(state);
  }

  // stop 時: duration を計算
  if (eventType === 'stop' && state[sessionId]?.prompt_submit_at) {
    duration_ms = now - state[sessionId].prompt_submit_at;
    delete state[sessionId];
    saveState(state);
  }

  const cwd = hookData.cwd || process.cwd();
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: eventType,
    session_id: sessionId,
    permission_mode: hookData.permission_mode || 'unknown',
    tool_name: hookData.tool_name || null,
    duration_ms: duration_ms,
    user: os.userInfo().username,
    project: path.basename(cwd),
    service: 'claude-code',
    ddsource: 'claude-code'
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
});
