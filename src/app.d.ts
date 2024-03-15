// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import 'unplugin-icons/types/svelte'
declare global {
	namespace App {
		interface Locals {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
	}
}

export {};