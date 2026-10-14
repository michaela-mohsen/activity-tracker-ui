"use client"

import ExerciseService from "@/app/service/ExerciseService";
import { useAuthStore } from "@/app/stores/UserStore";
import { Exercise } from "@/app/types/Exercise";
import Paper from "@mui/material/Paper";
import { useState, useRef, useEffect, useCallback } from "react";
import { DataGrid, getGridDateOperators, getGridStringOperators, GridColDef, GridFilterModel, GridRowsProp } from '@mui/x-data-grid';
import moment from "moment";
import { GridSortModel } from "@mui/x-data-grid";


export default function Page() {
    const [exercises, setExercises] = useState<Array<Exercise>>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const user = useAuthStore((state) => state.user);
    const hydrated = useAuthStore((state) => state.hydrated);
    const userId = user?.id ?? '';
    const requestedUserId = useRef<string>('');
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "exerciseStartDate", sort: 'desc' }]);
    const [filterOptions, setFilterOptions] = useState({ field: '', value: '' });

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
        const filterItem = filterModel?.items?.[0];
        let filterValue = filterItem?.value;
        let fieldValue = filterItem?.field;
        if (filterItem?.field === "exerciseStartDate") {
            filterValue = moment(filterValue).format();
            fieldValue = filterItem.operator === "onOrAfter" ? "dateFrom" : "dateTo";
        }
        setFilterOptions({ field: fieldValue, value: filterValue });
    }, []);


    const getExercises = (userId: string, currentPage: number, pageSize: number, sortProperty: string, direction: string, filterOptions: { field: string, value: string }) => {
        ExerciseService.get(userId, currentPage, pageSize, sortProperty, direction, filterOptions).then((response) => {
            const data = response.data;
            setExercises(data.exercises);
            setTotalItems(response.data.totalElements);
        }).catch(() => {
            userId = '';
        });
    }

    useEffect(() => {
        if (!hydrated || !userId || requestedUserId.current === userId || !sortModel[0]?.sort) {
            return;
        }
        getExercises(userId, paginationModel.page, paginationModel.pageSize, sortModel[0].field, sortModel[0].sort, filterOptions);
    }, [paginationModel, hydrated, userId, sortModel, filterOptions]);

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

    const convertToJavaScriptDate = (timestamp: string): Date => {
        return moment(timestamp).toDate();
    }

    const rows: GridRowsProp = exercises.map((exercise) => {
        return {
            id: exercise.id,
            activity: exercise.activity,
            duration: exercise.duration,
            exerciseStartDate: convertToJavaScriptDate(exercise.exerciseStartDate)
        }
    });

    const columns: GridColDef[] = [
        {
            field: 'activity',
            headerName: 'Activity',
            filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains' || operator.value === 'equals')
        },
        {
            field: 'duration',
            headerName: 'Duration',
            filterable: false,
            type: "number",
            valueFormatter: (value: number) => { return formatDuration(value) }
        },
        {
            field: 'exerciseStartDate',
            headerName: 'Date Logged',
            type: "dateTime",
            valueFormatter: (value: string) => { return formatDate(value) },
            filterOperators: getGridDateOperators().filter((operator) => operator.value === 'onOrAfter' || operator.value === 'onOrBefore')
        }
    ]

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <DataGrid
                rows={rows}
                rowCount={totalItems}
                columns={columns}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={(sortModel) => setSortModel(sortModel)}
                filterMode="server"
                onFilterModelChange={onFilterChange}
                autoHeight
                pageSizeOptions={[10, 25, 50]}
            />
        </Paper>
    )
}