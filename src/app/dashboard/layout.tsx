import Grid from "@mui/material/Grid";
import NavTabs from "../components/NavTabs";
import Divider from "@mui/material/Divider"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
            <Grid container spacing={0}>
                <NavTabs />
                <Divider orientation="vertical" flexItem />
            </Grid>
            {children}
        </Grid>
    );
}