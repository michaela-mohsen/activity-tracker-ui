"use client"

import ExerciseService from "@/app/service/ExerciseService";
import { useAuthStore } from "@/app/stores/UserStore";
import Paper from "@mui/material/Paper";
import { useState, useMemo } from "react";
import { DataGrid, getGridDateOperators, getGridStringOperators, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import moment from "moment";
import { GridDataSource } from "@mui/x-data-grid";


export default function Page() {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ?? '';
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });

    const dataSource: GridDataSource = useMemo(() => ({
        getRows: async (params) => {
            const urlParams = new URLSearchParams({
                page: JSON.stringify(params.paginationModel?.page),
                size: JSON.stringify(params.paginationModel?.pageSize),
                sortProperty: params.sortModel?.[0]?.field ?? '',
                direction: params.sortModel[0].sort ?? ''
            });
            if (params.filterModel) {
                const filterItem = params.filterModel.items?.[0];
                let filterValue = filterItem?.value;
                let fieldValue = filterItem?.field;
                if (filterItem?.field === "exerciseStartDate") {
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
            const getRowsResponse = await ExerciseService.get(userId, urlParams.toString());
            return {
                rows: getRowsResponse.data.exercises,
                rowCount: getRowsResponse.data.totalElements
            };
        },
    }),
        [userId]
    );

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

    const columns: GridColDef[] = [
        {
            field: 'activity',
            headerName: 'Activity',
            filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains' || operator.value === 'equals'),
            minWidth: 150
        },
        {
            field: 'duration',
            headerName: 'Duration',
            filterable: false,
            type: "number",
            valueFormatter: (value: number) => { return formatDuration(value) },
            minWidth: 225
        },
        {
            field: 'exerciseStartDate',
            headerName: 'Date Logged',
            type: "dateTime",
            valueFormatter: (value: string) => { return formatDate(value) },
            filterOperators: getGridDateOperators().filter((operator) => operator.value === 'onOrAfter' || operator.value === 'onOrBefore' || operator.value === 'is'),
            flex: 1
        }
    ]

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <DataGrid
                columns={columns}
                dataSource={dataSource}
                pagination
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 }, rowCount: 0 },
                    sorting: { sortModel: [{ field: "exerciseStartDate", sort: 'desc' }] }
                }}
                autoHeight
                pageSizeOptions={[10, 25, 50]}
                checkboxSelection
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={rowSelectionModel => setRowSelectionModel(rowSelectionModel)}
            />
        </Paper>
    )
}