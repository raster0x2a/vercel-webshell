const { exec } = require('child_process');
const crypto = require('crypto');


const SECRET_HASH = "4be7de85c6bad019834ef6843189edd6a5710e800806794349658fcafdc83af9";

export default function handler(req, res) {
  // pass check
  const hash = crypto.createHash('sha256');
  hash.update(req.query.p);
  const hashedData = hash.digest('hex');
  if (hashedData !== SECRET_HASH) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // POSTメソッド以外は許可しない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Invalid command provided.' });
  }

  // コマンドと引数を分割
  //const [cmd, ...args] = command.trim().split(/\s+/);
  
  // VercelのServerless Functionは書き込み不可のファイルシステムなので、
  // 'ls -F' のような引数は安全と見なせる
  //const fullCommand = `${cmd} ${args.join(' ')}`;

  exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
    if (error) {
      // 終了コードが0でない場合もエラーとして扱う
      return res.status(500).json({ output: stderr || error.message });
    }
    res.status(200).json({ output: stdout });
  });
}
