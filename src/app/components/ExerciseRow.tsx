"use client";

import { Fragment, useId, useState } from "react";
import { Exercise } from "../types/Exercise";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import moment from "moment";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";

export default function ExerciseRow(props: { row: Exercise, key: string }) {
    const [open, setOpen] = useState(false);
    const detailsId = useId();

    const hasValue = (value: string | number): boolean => {
        return value ? true : false;
    }

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

    const hasExerciseData = (exercise: Exercise): boolean => {
        const caloriesValue = exercise.totalCalories;
        const stepsValue = exercise.totalSteps;
        const distanceValue = exercise.totalDistance;
        if (!caloriesValue && !stepsValue && !distanceValue) {
            return false;
        }
        return true;
    }

    const truncateDistance = (totalDistance: number): string => {
        if (totalDistance) {
            return totalDistance.toPrecision(2);
        }
        return totalDistance?.toString();
    }

    return (
        <Fragment>
            <TableRow key={props.row.id}>
                <TableCell>{props.row.activity}</TableCell>
                <TableCell>{formatDuration(props.row.duration)}</TableCell>
                <TableCell>{formatDate(props.row.exerciseStartDate)}</TableCell>
                <TableCell>
                    <IconButton
                        aria-label={open ? 'collapse row' : 'expand row'}
                        aria-expanded={open}
                        aria-controls={detailsId}
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow id={detailsId} aria-hidden={!open ? true : undefined}>
                <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <List subheader={
                                <ListSubheader component="div" id="list-subheader">
                                    {'Data from ' + props.row.source}
                                </ListSubheader>
                            }>
                                {hasExerciseData(props.row) && (<Divider />)}

                                {hasValue(props.row.totalDistance) && (
                                    <ListItem>{truncateDistance(props.row.totalDistance) + ' ' + props.row.distanceUnit}</ListItem>
                                )}

                                {hasValue(props.row.totalCalories) && (
                                    <ListItem>{props.row.totalCalories.toLocaleString("en-US") + ' calories burned'}</ListItem>
                                )}

                                {hasValue(props.row.totalSteps) && (
                                    <ListItem>{props.row.totalSteps.toLocaleString("en-US") + ' steps'}</ListItem>
                                )}
                            </List>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>

    );
}