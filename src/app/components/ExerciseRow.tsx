"use client";

import { useId, useState } from "react";
import { Exercise } from "../types/Exercise";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import moment from "moment";

export default function ExerciseRow(props: { row: Exercise, key: string }) {
    const [open, setOpen] = useState(false);
    const detailsId = useId();
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

    return (
        <TableRow key={props.row.id}>
            <TableCell>{props.row.activity}</TableCell>
            <TableCell>{formatDuration(props.row.duration)}</TableCell>
            <TableCell>{formatDate(props.row.exerciseStartDate)}</TableCell>
            <TableCell>
                <IconButton size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
    );
}