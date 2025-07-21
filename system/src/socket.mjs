export default function registerSocketEvents() {
	game.socket.on(`system.${SYSTEM_ID}`, event => {
		if (event.type === "setCounter" && game.user.isGM) {
			dreams.app.MomentumTrackerV2.setCounter(
				event.payload.value,
				event.payload.type
			);
		}

		if (event.type === "updateCounter") {
			dreams.app.MomentumTrackerV2.instance.render({force: true});
		}
	});
}
