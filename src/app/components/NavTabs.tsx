"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { usePathname } from "next/navigation";
import Link from "./Link";
import { Box, Typography } from "@mui/material";
import { TabContext } from "@mui/lab";

const tabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Exercises", href: "/dashboard/exercises" },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            tabIndex={0}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function NavTabs() {
    const pathname = usePathname();
    const selected = tabs.findIndex((tab) => tab.href === pathname);

    return (
        <Box>
            <Tabs value={selected >= 0 ? selected : false}>
                {tabs.map((tab) => (
                    <Tab key={tab.href} component={Link} href={tab.href} label={tab.label} />
                ))}
            </Tabs>
        </Box>
    );
}