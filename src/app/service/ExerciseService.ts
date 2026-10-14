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
	let searchUrl = `/v1/exercises/${userId}?page=${page}&size=${size}&sortProperty=${sortProperty}&direction=${direction}`;
	if (filterOptions?.value) {
		searchUrl = `${searchUrl}&${filterOptions.field}=${filterOptions.value}`;
	}
	return httpCommon.get<IExerciseData>(searchUrl, { headers: authHeader() });
};

const ExerciseService = { get };
export default ExerciseService;
