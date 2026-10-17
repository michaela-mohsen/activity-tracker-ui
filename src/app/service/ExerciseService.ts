import httpCommon from "../http-common";
import { IExerciseData } from "../types/Exercise";
import authHeader from "./AuthHeader";

const get = (userId: string, params: string) => {
	const searchUrl = `/v1/exercises/${userId}?${params}`;
	return httpCommon.get<IExerciseData>(searchUrl, { headers: authHeader() });
};
const ExerciseService = { get };
export default ExerciseService;
