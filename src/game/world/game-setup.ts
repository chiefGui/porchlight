import { setupInitialContent } from "../../content/pack/base/index.ts";

/**
 * Handles the initial game setup.
 * Delegates to the content pack for narrative content.
 */
export class GameSetup {
	/**
	 * Initialize a new game.
	 * The actual content is defined in the content pack.
	 */
	static initialize(): void {
		setupInitialContent();
	}
}
