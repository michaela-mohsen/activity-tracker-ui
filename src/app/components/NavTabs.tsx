"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { usePathname } from "next/navigation";
import Link from "./Link";
import { Box } from "@mui/material";

const tabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Exercises", href: "/dashboard/exercises" },
];

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