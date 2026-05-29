export const HOUSEHOLD_NAMES = {
	iqbal: 'Iqbal',
	partner: 'Mufti'
} as const;

export type HouseholdPerson = (typeof HOUSEHOLD_NAMES)[keyof typeof HOUSEHOLD_NAMES];

export function normalizeHouseholdName(name: string | null | undefined): HouseholdPerson {
	return name === 'Iqbal' ? 'Iqbal' : 'Mufti';
}
