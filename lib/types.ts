export interface Task {
	id: string;
	householdId: string;
	title: string;
	description?: string;
	assignedTo: 'Iqbal' | 'Mufti' | 'Puing';
	dueTime?: string;
	dueDate: string;
	completed: boolean;
	completedAt?: string;
	priority?: 'low' | 'medium' | 'high' | null;
	recurring?: 'daily' | 'weekly' | 'monthly' | null;
	category?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CatLog {
	id: string;
	householdId: string;
	type: 'feeding' | 'water' | 'poo' | 'play_outside' | 'bath' | 'grooming' | 'medication' | 'note';
	description: string;
	timestamp: string;
	createdAt: string;
	updatedAt: string;
	notes?: string;
	photoUrl?: string;
}

export interface Mood {
	id: string;
	householdId: string;
	partner: 'Iqbal' | 'Mufti' | 'Puing';
	mood: 'happy' | 'tired' | 'productive' | 'sleepy' | 'stressed' | 'hungry';
	date: string;
	timestamp: string;
	createdAt: string;
	updatedAt: string;
}

export interface Note {
	id: string;
	householdId: string;
	content: string;
	author: 'Iqbal' | 'Mufti' | 'Puing';
	noteTime?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Household {
	id: string;
	pin: string;
	createdAt: string;
	updatedAt: string;
	members: {
		name: string;
		role: string;
	}[];
}

export interface Notification {
	id: string;
	householdId: string;
	taskId?: string;
	type: 'reminder' | 'overdue' | 'completion';
	message: string;
	read: boolean;
	createdAt: string;
}
