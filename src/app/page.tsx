import styles from "./page.module.css";
import Login from "./login/page";
import { Grid } from "@mui/material";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Grid container>
          <Grid size={7} sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
            Welcome to Activity Tracker
          </Grid>
          <Grid size={5}>
            <Login />
          </Grid>
        </Grid>
      </main>
    </div>
  );
}
