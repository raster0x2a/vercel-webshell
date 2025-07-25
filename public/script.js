const commandInput = document.getElementById('commandInput');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

commandInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command === '') return;

        // 入力されたコマンドを表示
        output.textContent += `\n$ ${command}\n`;
        commandInput.value = '';

        if (command.toLowerCase() === 'clear') {
            output.textContent = 'Welcome to rashell!';
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }

        try {
            const url = new URL(window.location.href);
            const pass = url.searchParams.get('p');
            // APIにコマンドを送信
            const response = await fetch(`/api/execute?p=${pass}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command }),
            });

            const data = await response.json();
            
            // 結果を表示
            output.textContent += data.output || data.error;

        } catch (error) {
            output.textContent += `\nClient-side error: ${error.message}`;
        }

        // 自動でスクロール
        terminal.scrollTop = terminal.scrollHeight;
    }
});
