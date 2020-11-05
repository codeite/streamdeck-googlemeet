
import { Button } from './Button';
import { Bridge } from './Bridge';
import { Logger } from './Logger';
import { Action } from './Action';

const SAFETY_DELAY = 100;
let websocketToStreamDeck: WebSocket;
let buttons: Buttons = {};

const logger = new Logger(true);
const bridge = new Bridge('iamtheplugin', handleBridgeMessages);

// @ts-ignore
window.connectElgatoStreamDeckSocket = function connectElgatoStreamDeckSocket(inPort: string, inPluginUUID: string, inRegisterEvent: string) {
	websocketToStreamDeck = new WebSocket('ws://127.0.0.1:' + inPort);

	websocketToStreamDeck.onopen = function () {
		registerPlugin(inPluginUUID);
	};

	websocketToStreamDeck.onmessage = handlePluginMessages;

	function registerPlugin(inPluginUUID: string) {
		var json = {
			event: inRegisterEvent,
			uuid: inPluginUUID,
		};

		websocketToStreamDeck.send(JSON.stringify(json));
	}
}

const redHangUp = 'data:image/svg+xml;charset=utf8,<svg focusable="false" width="144" height="144" viewBox="0 0 24 24" ><path fill="#ea080f" d="M23.62 11.27c-2.03-1.72-4.46-3-7.12-3.69C15.06 7.21 13.56 7 12 7s-3.06.21-4.5.58c-2.66.69-5.08 1.96-7.12 3.69-.45.38-.5 1.07-.08 1.49l.67.67 2.26 2.26c.33.33.85.39 1.25.13l2.56-1.64c.29-.18.46-.5.46-.84V9.65C8.93 9.23 10.44 9 12 9s3.07.23 4.5.65v3.68c0 .34.17.66.46.84l2.56 1.64c.4.25.92.2 1.25-.13l2.26-2.26.67-.67c.41-.41.37-1.1-.08-1.48z"></path></svg>'
function handleBridgeMessages(event: MessageEvent) {
	logger.debug(`Received message: ${event.data}`);
	const msg: StateMessage = JSON.parse(event.data);
	if (msg.type === 'muteState' && buttons['be.jeroenvdb.googlemeet.togglemute']) {
		setTimeout(() => {
			buttons['be.jeroenvdb.googlemeet.togglemute'].setState(msg.value === 'unmuted' ? 0 : 1);
		}, SAFETY_DELAY);
	} else if (msg.type === 'cameraState' && buttons['be.jeroenvdb.googlemeet.togglecamera']) {
		setTimeout(() => {
			buttons['be.jeroenvdb.googlemeet.togglecamera'].setState(msg.value === 'unhidden' ? 0 : 1);
		}, SAFETY_DELAY);
	} else if (msg.type === 'callState' && buttons['be.jeroenvdb.googlemeet.onleavecall']) {
		setTimeout(() => {
			if (msg.value === 'oncall') {
				buttons['be.jeroenvdb.googlemeet.onleavecall'].setTitle('On Call')
				buttons['be.jeroenvdb.googlemeet.onleavecall'].setSvg(redHangUp)
			} else if (msg.value === 'inloby') {
				buttons['be.jeroenvdb.googlemeet.onleavecall'].setTitle('In Loby')
				buttons['be.jeroenvdb.googlemeet.onleavecall'].setSvg('')
			} else {
				buttons['be.jeroenvdb.googlemeet.onleavecall'].setTitle('')
				buttons['be.jeroenvdb.googlemeet.onleavecall'].setSvg('')
			}
		}, SAFETY_DELAY);
	}
	
	
}

function handlePluginMessages(evt: MessageEvent) {
	const message = JSON.parse(evt.data);
	const event = message['event'];
	const action = message['action'];
	const context = message['context'];

	switch (event) {
		case 'keyDown':
			bridge.connect();
			bridge.sendMessage(new Action(action));
			break;
		case 'willAppear':
			bridge.connect();
			registerActionButton(action, context);
			break;
	}
}

function registerActionButton(streamDeckAction: string, context: string) {
	buttons[streamDeckAction] = new Button(streamDeckAction, context, websocketToStreamDeck);
}

type StateMessage = {
	type: 'muteState';
	value: 'muted' | 'unmuted';
} | {
	type: 'cameraState';
	value: 'hidden' | 'unhidden';
} | {
	type: 'callState';
	value: 'oncall' | 'notoncall' | 'inloby';
};

type Buttons = {
	[index: string]: Button;
}


