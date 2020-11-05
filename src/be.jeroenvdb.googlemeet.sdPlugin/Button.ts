export class Button {
	streamDeckAction: string;
	context: string;
	websocketToStreamDeck: WebSocket;

	constructor(streamDeckAction: string, context: string, websocketToStreamDeck: WebSocket) {
		this.streamDeckAction = streamDeckAction;
		this.context = context;
		this.websocketToStreamDeck = websocketToStreamDeck;
	}

	setState(state: number) {
		var json = {
			event: 'setState',
			context: this.context,
			payload: {
				state: state,
			},
		};

		this.websocketToStreamDeck.send(JSON.stringify(json));
	}

	setTitle(title: string) {
		var json = {
			"event": 'setTitle',
			"context": this.context,
			"payload": {
				"title": title
			}
		}
		this.websocketToStreamDeck.send(JSON.stringify(json));
	};

	setSvg(svg: string) {
		var json = {
			"event": 'setTitle',
			"context": this.context,
			"payload": {
				"image": svg
			}
		}
		this.websocketToStreamDeck.send(JSON.stringify(json));
	};
}
