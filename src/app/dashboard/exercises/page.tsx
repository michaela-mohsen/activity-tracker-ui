"use client"

import ExerciseService from "@/app/service/ExerciseService";
import { useAuthStore } from "@/app/stores/UserStore";
import { Exercise } from "@/app/types/Exercise";
import Paper from "@mui/material/Paper";
import { useState, useRef, useEffect } from "react";
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import moment from "moment";


export default function Page() {
    const [exercises, setExercises] = useState<Array<Exercise>>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const user = useAuthStore((state) => state.user);
    const hydrated = useAuthStore((state) => state.hydrated);
    const userId = user?.id ?? '';
    const requestedUserId = useRef<string | null>(null);

    useEffect(() => {
        if (!hydrated || !userId || requestedUserId.current === userId) {
            return;
        }
        ExerciseService.get(userId, currentPage, pageSize).then((response) => {
            const data = response.data;
            setExercises(data.exercises);
        }).catch(() => {
            requestedUserId.current = null;
        });
    }, [currentPage, hydrated, pageSize, userId]);

    const formatDuration = (durationInMillis: number): string => {
        let secondsString = '';
        let minutesString = '';
        let hoursString = '';
        if (durationInMillis == null) {
            console.log("duration is null, cannot format")
            return '';
        }
        const totalSeconds = Math.floor(durationInMillis / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            hoursString = `${hours} hours`
        }
        if (minutes > 0) {
            minutesString = `${minutes} minutes`
        }
        if (seconds > 0) {
            secondsString = `${seconds} seconds`
        }

        return Array.of(hoursString, minutesString, secondsString).filter(Boolean).join(", ");
    }

    const formatDate = (timestamp: string): string => {
        return moment(timestamp).format("MM-DD-YYYY hh:mm a");
    }

    const convertToJavaScriptDate = (timestamp: string): Date => {
        return moment(timestamp).toDate();
    }

    const rows: GridRowsProp = exercises.map((exercise) => {
        return {
            id: exercise.id,
            activity: exercise.activity,
            duration: exercise.duration,
            startDate: convertToJavaScriptDate(exercise.exerciseStartDate)
        }
    });

    const columns: GridColDef[] = [
        { field: 'activity', headerName: 'Activity' },
        { field: 'duration', headerName: 'Duration', type: "number", valueFormatter: (value: number) => { return formatDuration(value) } },
        { field: 'startDate', headerName: 'Date Logged', type: "dateTime", valueFormatter: (value: string) => { return formatDate(value) } }
    ]

    return (
        <div>
            <Paper>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    pageSizeOptions={[10]}
                />
            </Paper>
        </div>
    )
}