"use client"

import ExerciseService from "@/app/service/ExerciseService";
import { useAuthStore } from "@/app/stores/UserStore";
import { Exercise } from "@/app/types/Exercise";
import { TableSortLabel } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { GridFilterModel } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Page() {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ?? '';
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortModel, setSortModel] = useState<{ field: string, sort: "asc" | "desc" }>({ field: "exerciseStartDate", sort: 'desc' });
    const [filterModel, setFilterModel] = useState<GridFilterModel>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadExercises() {
            setLoading(true);
            try {
                const urlParams = new URLSearchParams({
                    page: JSON.stringify(page),
                    size: JSON.stringify(pageSize),
                    sortProperty: sortModel?.field ?? '',
                    direction: sortModel?.sort ?? ''
                });
                if (filterModel) {
                    const filterItem = filterModel.items?.[0];
                    let filterValue = filterItem?.value;
                    let fieldValue = filterItem?.field;
                    if (fieldValue === "exerciseStartDate") {
                        filterValue = moment(filterValue).utc().format();
                        switch (filterItem?.operator) {
                            case "onOrAfter": {
                                fieldValue = "dateFrom";
                                break;
                            }
                            case "onOrBefore": {
                                fieldValue = "dateTo";
                                break;
                            }
                            default: {
                                fieldValue = "dateOn";
                                break;
                            }
                        }
                    }
                    urlParams.append(fieldValue, filterValue)
                }
                const response = await ExerciseService.get(userId, urlParams.toString());
                if (active) {
                    setExercises(response.data.exercises);
                    setTotalElements(response.data.totalElements);
                }
            }
            finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void loadExercises();
        return () => {
            active = false;
        }
    }, [userId, page, pageSize, sortModel, filterModel]);

    const columns = [
        {
            id: 'activity',
            field: 'activity',
            headerName: 'Activity',
            sortDirection: false as const
        },
        {
            id: 'duration',
            field: 'duration',
            headerName: 'Duration',
            sortDirection: false as const
        },
        {
            id: 'exerciseStartDate',
            field: 'exerciseStartDate',
            headerName: 'Date Logged',
            sortDirection: false as const
        }
    ]

    const formatDuration = (durationInMillis: number): string => {
        let secondsString = '';
        let minutesString = '';
        let hoursString = '';
        if (durationInMillis == null) {
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

    const onSort = (columnId: string) => {
        const isAscending = sortModel.field === columnId && sortModel.sort === 'asc';
        setSortModel({ field: columnId, sort: isAscending ? 'desc' : 'asc' });
    }

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} sortDirection={column.sortDirection}>
                                    <TableSortLabel
                                        active={sortModel.field === column.id}
                                        direction={sortModel.field === column.id ? sortModel.sort : "desc"}
                                        onClick={() => onSort(column.id)}
                                    >
                                        {column.headerName}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                                <TableCell>{exercise.activity}</TableCell>
                                <TableCell>{formatDuration(exercise.duration)}</TableCell>
                                <TableCell>{formatDate(exercise.exerciseStartDate)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}