import styles from "./page.module.css";
import { Artists } from "./components/Artists";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Artists />
      </main>
    </div>
  );
}
