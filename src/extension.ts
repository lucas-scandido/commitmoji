import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('commitmoji.showEmojis', async () => {
		const emojis = [
			{ label: '🎉', description: 'Inicial setup' },
			{ label: '🏗️ [build]: ', description: 'Build system or dependency changes' },
			{ label: '🔧 [chore]: ', description: 'Other changes (e.g., build scripts, config files)' },
			{ label: '👷‍♂️ [ci]: ', description: 'CI/CD changes' },
			{ label: '📖 [docs]: ', description: 'Documentation changes' },
			{ label: '🚀 [feat]: ', description: 'A new feature' },
			{ label: '🐛 [fix]: ', description: 'A bug fix' },
			{ label: '⚡ [perf]: ', description: 'Performance improvements' },
			{ label: '🛠️ [refactor]: ', description: 'Code refactoring' },
			{ label: '🔙 [revert]: ', description: 'Revert a previous commit' },
			{ label: '🎨 [style]: ', description: 'Code style changes (e.g., formatting)' },
			{ label: '🧪 [test]: ', description: 'Adding or updating tests' },
		];

		const selectedEmoji = await vscode.window.showQuickPick(emojis, {
			placeHolder: 'Select a convention for your commit'
		});

		if (selectedEmoji) {
			await vscode.env.clipboard.writeText(selectedEmoji.label);

			await vscode.commands.executeCommand('workbench.scm.focus');

			await new Promise(resolve => setTimeout(resolve, 100));

			await vscode.commands.executeCommand('editor.action.clipboardPasteAction');

			vscode.window.showInformationMessage(`"${selectedEmoji.label}" has been added to your commit message!`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }