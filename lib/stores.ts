import { create } from 'zustand';
import { findHouseholdByPin } from './household-auth';

interface HouseholdStore {
	householdId: string | null;
	setHouseholdId: (id: string) => void;
	pin: string | null;
	setPIN: (pin: string) => void;
	isAuthenticated: boolean;
	authenticate: (pin: string) => Promise<boolean>;
	logout: () => void;
}

const DEMO_PIN = '1234';
const DEMO_HOUSEHOLD_ID = 'demo-household-001';

export const useHouseholdStore = create<HouseholdStore>((set, get) => ({
	householdId: null,
	setHouseholdId: (id: string) => set({ householdId: id }),
	pin: null,
	setPIN: (pin: string) => set({ pin }),
	isAuthenticated: false,

	authenticate: async (inputPin: string) => {
		const household = await findHouseholdByPin(inputPin);
		if (household) {
			set({
				pin: inputPin,
				householdId: household.id,
				isAuthenticated: true
			});
			localStorage.setItem('mochi-household-id', household.id);
			localStorage.setItem('mochi-pin', inputPin);
			return true;
		}

		if (inputPin === DEMO_PIN) {
			set({
				pin: inputPin,
				householdId: DEMO_HOUSEHOLD_ID,
				isAuthenticated: true
			});
			localStorage.setItem('mochi-household-id', DEMO_HOUSEHOLD_ID);
			localStorage.setItem('mochi-pin', inputPin);
			return true;
		}
		return false;
	},

	logout: () => {
		set({
			pin: null,
			householdId: null,
			isAuthenticated: false
		});
		localStorage.removeItem('mochi-household-id');
		localStorage.removeItem('mochi-pin');
	}
}));

// Try to restore session from localStorage
if (typeof window !== 'undefined') {
	const savedHouseholdId = localStorage.getItem('mochi-household-id');
	const savedPin = localStorage.getItem('mochi-pin');

	if (savedHouseholdId && savedPin) {
		useHouseholdStore.setState({
			householdId: savedHouseholdId,
			pin: savedPin,
			isAuthenticated: true
		});
	}
}
