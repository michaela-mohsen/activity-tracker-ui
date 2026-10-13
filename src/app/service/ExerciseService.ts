import httpCommon from "../http-common";
import { IExerciseData } from "../types/Exercise";
import authHeader from "./AuthHeader";

const get = (
	userId: string,
	page: number,
	size: number,
	sortProperty: string,
	direction: string,
	filterOptions: { field: string; value: string },
) => {
	let url = `/v1/exercises/${userId}?page=${page}&size=${size}&sortProperty=${sortProperty}&direction=${direction}`;
	if (filterOptions) {
		url = `/v1/exercises/${userId}?
		page=${page}
		&size=${size}
		&sortProperty=${sortProperty}
		&direction=${direction}
		&${filterOptions.field}=${filterOptions.value}`;
	}
	return httpCommon.get<IExerciseData>(url, { headers: authHeader() });
};

const ExerciseService = { get };
export default ExerciseService;
