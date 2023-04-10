const vscode = require('vscode');

const paths = [
	{ path: "Assets/Demons/Animations/antlered rascal/AntleredRascalIdleFront/antleredrascalidleFront.gif", width: 100 },
	{ path: "Assets/Demons/Animations/fledgling demon/FledglingDemonIdleFront/FledglingDemonIdleFront.gif", width: 100 },
	{ path: "Assets/Demons/Animations/pit balor/PitBalorIdleFront/PitBalorIdleFront.gif", width: 200 },
	{ path:"Assets/Demons/Animations/arch fiend/ArchFiendIdleFront/ArchFiendIdleFront.gif", width: 300 },
]
let count = 0

function activate(context) {

	let panel = vscode.WebviewPanel | undefined;

	context.subscriptions.push(vscode.commands.registerCommand('animal-companion.start-session', () => {
		// Create and show a new webview
		panel = vscode.window.createWebviewPanel(
			'animal-companion', // Identifies the type of the webview. Used internally
			'Animal Companion', // Title of the panel displayed to the user
			vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
			{
				enableScripts: true
			} // Webview options. More on these later.
		);

		const updateWebView = () => {
			let index = count++ % paths.length;

			let demon_path = vscode.Uri.joinPath(context.extensionUri, paths[index]["path"])

			const demonGif = panel.webview.asWebviewUri(demon_path);
			panel.webview.html = getWebViewContent(demonGif, paths[index]["width"]);
		}

		updateWebView();
		setInterval(updateWebView, 1000);

		panel.webview.postMessage({command: 'walking'});
		

		panel.onDidDispose(() => {
			panel = undefined;
		},
		undefined,
		context.subscriptions)
	}));
}

function getWebViewContent(demon_path, demon_size) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>

	<style>
		img {
			image-rendering: pixelated;
			image-rendering: -moz-crisp-edges;
			image-rendering: crisp-edges;
			position:absolute;
			bottom:0;
			left:50%;
			transform:translate(-50%);
		}
	</style>
</head>
<body>
    <img id="demon" src="${demon_path}" width="${demon_size}" />

	<script>
		let state = "walking";
		let direction = 1;
		let x = 0;
		let speed = 10;

		window.addEventListener('message', even => {
			switch(event.data.command) {
				case "idle":
					state = "idle"
					break;
				case "walking":
					state = "walking"
					break;
				default:
					break;
			}
		})

		// setInterval(() => {
		// 	if(state == "idle") {
		// 		console.log("idle");
		// 	}
		// 	if(state == "walking") {
		// 		console.log("walking");
		// 		let rect = document.getElementById("demon").getBoundingClientRect();
		// 		if(rect.left <= 0) {
		// 			direction = 1;
		// 		}
		// 		if(rect.right >= (window.innerWidth || document.documentElement.clientWidth)) {
		// 			direction = -1;
		// 		}
	
		// 		x += speed * direction;
		// 		document.getElementById("demon").style.left = x + 'px';
		// 	}
		// }, 300)
		
	</script>
</body>
</html>`;
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
