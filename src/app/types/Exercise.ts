export interface IExerciseData {
	exercises: Array<Exercise>;
	totalElements: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

export interface Exercise {
	id: string;
	exerciseStartDate: string;
	duration: number;
	activity: string;
	distanceUnit: string;
	totalCalories: number;
	totalSteps: number;
	totalDistance: number;
	source: string;
}

export interface TimeDuration {
	hours: number;
	minutes: number;
	seconds: number;
}
