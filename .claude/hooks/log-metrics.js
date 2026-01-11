const fs = require('fs');
const path = require('path');

// プロジェクトの .claude ディレクトリにログを保存
const LOG_FILE = path.join(__dirname, '..', 'metrics.log');

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

  const logEntry = {
    timestamp: new Date().toISOString(),
    event: eventType,
    session_id: hookData.session_id || 'unknown',
    permission_mode: hookData.permission_mode || 'unknown',
    tool_name: hookData.tool_name || null,
    cwd: hookData.cwd || null
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
});
