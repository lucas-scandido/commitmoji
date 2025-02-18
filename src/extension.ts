import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    const getUseEmoji = (): boolean => context.globalState.get<boolean>('commitmoji.useEmoji', true);

    const askForEmojiPreference = async () => {
        const result = await vscode.window.showQuickPick(
            ['With Emoji', 'Without Emoji'],
            { placeHolder: 'Would you like to use emojis in your commits?' }
        );

        if (result) {
            const newPreference = result === 'With Emoji';
            await context.globalState.update('commitmoji.useEmoji', newPreference);
            vscode.window.showInformationMessage(`Preference set to ${newPreference ? 'With Emoji' : 'Without Emoji'}.`);
        }
    };

    const useEmoji = getUseEmoji();
    if (useEmoji === undefined) {
        await askForEmojiPreference();
    }

    let disposable = vscode.commands.registerCommand('commitmoji.showEmojis', async () => {
        const useEmoji = getUseEmoji();

        const emojis = [
            { label: useEmoji ? '🎉 [setup]:' : '[setup]:', description: 'Inicial commit' },
            { label: useEmoji ? '🏗️ [build]: ' : '[build]: ', description: 'Build system or dependency changes' },
            { label: useEmoji ? '🔧 [chore]: ' : '[chore]: ', description: 'Other changes (e.g., build scripts, config files)' },
            { label: useEmoji ? '👷‍♂️ [ci]: ' : '[ci]: ', description: 'CI/CD changes' },
            { label: useEmoji ? '📖 [docs]: ' : '[docs]: ', description: 'Documentation changes' },
            { label: useEmoji ? '🚀 [feat]: ' : '[feat]: ', description: 'A new feature' },
            { label: useEmoji ? '🐛 [fix]: ' : '[fix]: ', description: 'A bug fix' },
            { label: useEmoji ? '⚡ [perf]: ' : '[perf]: ', description: 'Performance improvements' },
            { label: useEmoji ? '🛠️ [refactor]: ' : '[refactor]: ', description: 'Code refactoring' },
            { label: useEmoji ? '🔙 [revert]: ' : '[revert]: ', description: 'Revert a previous commit' },
            { label: useEmoji ? '🎨 [style]: ' : '[style]: ', description: 'Code style changes (e.g., formatting)' },
            { label: useEmoji ? '🧪 [test]: ' : '[test]: ', description: 'Adding or updating tests' },
        ];

        const selectedEmoji = await vscode.window.showQuickPick(emojis, {
            placeHolder: 'Select a convention for your commit'
        });

        if (selectedEmoji) {
            const clipboardText = await vscode.env.clipboard.readText();

            if (clipboardText === selectedEmoji.label) {
                vscode.window.showWarningMessage('Convention already selected!');
                return;
            }

            await vscode.env.clipboard.writeText(selectedEmoji.label);

            await vscode.commands.executeCommand('workbench.scm.focus');

            await new Promise(resolve => setTimeout(resolve, 100));

            await vscode.commands.executeCommand('editor.action.selectAll');
            await vscode.commands.executeCommand('editor.action.deleteLines');

            await vscode.commands.executeCommand('editor.action.clipboardPasteAction');

            vscode.window.showInformationMessage(`"${selectedEmoji.label}" has been added to your commit message!`);
        }
    });

    const switchEmojiPreference = vscode.commands.registerCommand('commitmoji.switchEmojiPreference', async () => {
        const currentPreference = getUseEmoji();
        const newPreference = !currentPreference;

        await context.globalState.update('commitmoji.useEmoji', newPreference);

        vscode.window.showWarningMessage(
            `Preferences changed to ${newPreference ? 'Convention With Emoji' : 'Convention Without Emoji'}.`
        );

        setTimeout(() => {
            vscode.window.showInformationMessage(
                'From now, your commits will default to this format.'
            );
        }, 1000);
    });

    context.subscriptions.push(disposable, switchEmojiPreference);
}
export function deactivate() { }