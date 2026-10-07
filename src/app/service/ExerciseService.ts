import httpCommon from "../http-common";
import { IExerciseData } from "../types/Exercise";
import authHeader from "./AuthHeader";

const get = (userId: string, page: number, size: number) => {
	return httpCommon.get<IExerciseData>(
		`/v1/exercises/${userId}?page=${page}&size=${size}`,
		{ headers: authHeader() },
	);
};

const ExerciseService = { get };
export default ExerciseService;
