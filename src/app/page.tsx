import styles from "./page.module.scss";
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
