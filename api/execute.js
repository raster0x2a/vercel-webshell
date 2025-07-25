const { exec } = require('child_process');

// 実行を許可する安全なコマンドのホワイトリスト
const ALLOWED_COMMANDS = new Set([
]);

export default function handler(req, res) {
  // POSTメソッド以外は許可しない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Invalid command provided.' });
  }

  // コマンドと引数を分割
  const [cmd, ...args] = command.trim().split(/\s+/);

  // ホワイトリストに含まれているかチェック
  if (!ALLOWED_COMMANDS.has(cmd)) {
    return res.status(403).json({ output: `Error: Command not allowed: ${cmd}` });
  }
  
  // VercelのServerless Functionは書き込み不可のファイルシステムなので、
  // 'ls -F' のような引数は安全と見なせる
  const fullCommand = `${cmd} ${args.join(' ')}`;

  exec(fullCommand, { timeout: 3000 }, (error, stdout, stderr) => {
    if (error) {
      // 終了コードが0でない場合もエラーとして扱う
      return res.status(500).json({ output: stderr || error.message });
    }
    res.status(200).json({ output: stdout });
  });
}
