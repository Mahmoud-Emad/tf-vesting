import { writable } from 'svelte/store';
import type { AlertType } from './types';
export const alertStore = writable<AlertType>({});
