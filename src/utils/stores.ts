import { writable } from 'svelte/store';
import type { AlertType } from './types';
export const alertStore = writable<AlertType>({});
export const activatePKStore = writable<boolean>(false);
