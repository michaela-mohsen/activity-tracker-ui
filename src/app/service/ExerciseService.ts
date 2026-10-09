import httpCommon from "../http-common";
import { IExerciseData } from "../types/Exercise";
import authHeader from "./AuthHeader";

const get = (
	userId: string,
	page: number,
	size: number,
	sortProperty: string,
	direction: string,
) => {
	return httpCommon.get<IExerciseData>(
		`/v1/exercises/${userId}?page=${page}&size=${size}&sortProperty=${sortProperty}&direction=${direction}`,
		{ headers: authHeader() },
	);
};

const ExerciseService = { get };
export default ExerciseService;
