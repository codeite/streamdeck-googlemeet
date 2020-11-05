export class Action {
	type: MessageType;
	value: ActionType;

	constructor(streamDeckAction: StreamDeckActionType) {
		this.type = 'action';
		this.value = this.toAction(streamDeckAction);
	}

	toAction(streamDeckAction: StreamDeckActionType): ActionType {
		const streamDeckActionToActionMap: StreamDeckActionToActionMap = {
			'be.jeroenvdb.googlemeet.mute': 'mute',
			'be.jeroenvdb.googlemeet.unmute': 'unmute',
			'be.jeroenvdb.googlemeet.togglemute': 'togglemute',
			'be.jeroenvdb.googlemeet.togglecamera': 'togglecamera',
			'be.jeroenvdb.googlemeet.onleavecall': 'leavecall',
		};

		if (!streamDeckActionToActionMap[streamDeckAction]) {
			throw new Error(`Unsupported action: "${streamDeckAction}"`)
		}

		return streamDeckActionToActionMap[streamDeckAction];
	}
}

type StreamDeckActionToActionMap = {
	[index in StreamDeckActionType]: ActionType;
};

type StreamDeckActionType = (
	'be.jeroenvdb.googlemeet.mute' | 
  	'be.jeroenvdb.googlemeet.unmute' | 
  	'be.jeroenvdb.googlemeet.togglemute' | 
  	'be.jeroenvdb.googlemeet.togglecamera' |
  	'be.jeroenvdb.googlemeet.onleavecall'
);

type ActionType = 'mute' | 'unmute' | 'togglemute' | 'togglecamera' | 'leavecall';
export type MessageType = 'cameraState' | 'muteState' | 'action';
