import { JSX } from "react";
import styles from "./Loader.module.css";

export function Loader(): JSX.Element {
  return (
    <div className={styles.LoaderWrapper}>
      <div className={styles.Loader} />
    </div>
  );
}
