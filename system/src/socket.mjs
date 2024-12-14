export const SOCKET_NAME = "system.dreams-and-machines";

/**
 * @readonly
 * @enum {number}
 */
export const SocketOperation = {
	/**
	 * A player is attempting to spend Momentum.
	 */
	PlayerSpendMomentum: 0,

	/**
	 * A player is attempting to store Momentum.
	 */
	PlayerStoreMomentum: 1,
};


export default function listenOnSocket() {
	game.socket.on(SOCKET_NAME, async payload => {
		if (!dreams.app.MomentumTracker.instance) {
			return;
		}

		switch (payload.operation) {
			/**
				* Player has spent Momentum.
				*/
			case SocketOperation.PlayerSpendMomentum: {
				// Only GM clients should process the operation.
				if (!game.user.isGM) {
					return;
				}

				const momentum = dreams.app.MomentumTracker.instance.momentum;
				if (momentum === 0) {
					return;
				}

				await game.settings.set(
					SYSTEM_ID,
					"momentum",
					momentum - 1
				);

				dreams.app.MomentumTracker.forceRender();

				break;
			}

			/**
				* Player has stored Momentum.
				*/
			case SocketOperation.PlayerStoreMomentum: {
				// Only GM clients should process the operation.
				if (!game.user.isGM) {
					return;
				}

				const momentum = dreams.app.MomentumTracker.instance.momentum;
				if (momentum === 6) {
					return;
				}

				await game.settings.set(
					SYSTEM_ID,
					"momentum",
					momentum + 1
				);

				dreams.app.MomentumTracker.forceRender();

				break;
			}
		}
	});
}

/**
 * Emit a Socket operation.
 *
 * @param {SocketOperation} operation
 * @param {any} data
 */
export function socketEmit(operation, data = undefined) {
	/** @type SocketPayload */
	const payload = { operation, data };

	game.socket.emit(SOCKET_NAME, payload);
}
