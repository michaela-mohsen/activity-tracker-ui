import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>
          Welcome to Activity Tracker
        </h1>
        <p><Link href="/dashboard">Dashboard</Link></p>
      </main>
    </div>
  );
}
