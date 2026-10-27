"use client"

import ExerciseRow from "@/app/components/ExerciseRow";
import ExerciseService from "@/app/service/ExerciseService";
import { useAuthStore } from "@/app/stores/UserStore";
import { Exercise } from "@/app/types/Exercise";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import moment from "moment";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ?? '';
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortModel, setSortModel] = useState<{ field: string, sort: "asc" | "desc" }>({ field: "exerciseStartDate", sort: 'desc' });
    const [filterItem, setFilterItem] = useState<{ value: string, field: string, operator: string }>();
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
                if (filterItem) {
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
    }, [userId, page, pageSize, sortModel, filterItem]);

    const columns = [
        {
            id: 'activity',
            field: 'activity',
            headerName: 'Activity',
            sortDirection: false as const,
            filterOperators: ["contains"]
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
            sortDirection: false as const,
            filterOperators: ["onOrAfter", "onOrBefore", "is"]
        }
    ]

    const onFilter = (value: string, field: string, operator: string) => {
        setFilterItem({ value, field, operator });
    }

    const onSort = (columnId: string) => {
        const isAscending = sortModel.field === columnId && sortModel.sort === 'asc';
        setSortModel({ field: columnId, sort: isAscending ? 'desc' : 'asc' });
    }

    const onPageChange = (event: unknown, page: number) => {
        setPage(page);
    }

    const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value));
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises.map((exercise) => (
                            <ExerciseRow row={exercise} key={exercise.id} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination component='div' count={totalElements} onPageChange={onPageChange} page={page} onRowsPerPageChange={onRowsPerPageChange} rowsPerPage={pageSize} />
        </Paper>
    );
}