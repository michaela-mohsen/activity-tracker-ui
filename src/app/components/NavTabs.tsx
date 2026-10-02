"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { usePathname, useRouter } from "next/navigation";
import Link from "./Link";
import { Box, Button } from "@mui/material";
import AuthService from "../service/AuthService";

const tabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Exercises", href: "/dashboard/exercises" }
];

export default function NavTabs() {
    const pathname = usePathname();
    const selected = tabs.findIndex((tab) => tab.href === pathname);
    const router = useRouter();

    const logout = () => {
        console.log("logging out");
        AuthService.logout();
        router.push("/")
    }

    return (
        <Box sx={{ display: "grid" }}>
            <Tabs value={selected >= 0 ? selected : false} orientation="vertical">
                {tabs.map((tab) => (
                    <Tab key={tab.href} component={Link} href={tab.href} label={tab.label} />
                ))}
            </Tabs>
            <Button onClick={logout}>Log out</Button>
        </Box>
    );
}