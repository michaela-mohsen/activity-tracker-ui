'use client'

import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

export default function ColorTabs() {
    const [value, setValue] = React.useState('one');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
                <Tab value="one" label="Item One" />
                <Tab value="two" label="Item Two" />
                <Tab value="three" label="Item Three" />
            </Tabs>
        </Box>
    );
}