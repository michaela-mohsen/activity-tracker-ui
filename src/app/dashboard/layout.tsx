import Box from "@mui/material/Box";
import NavTabs from "../components/NavTabs";
import Divider from "@mui/material/Divider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: "flex", alignItems: "stretch", gap: 3 }}>
            <Box sx={{ display: "flex", flexShrink: 0 }}>
                <NavTabs />
                <Divider orientation="vertical" flexItem />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        </Box>
    );
}