import styles from "./page.module.css";
import TabsComponent from "./components/TabsComponent";


export default function Home() {
  return (
    <div className={styles.page}>
      <TabsComponent />
      <main className={styles.main}>
        <div>
          <p>Body</p>
        </div>
      </main>
    </div>
  );
}
