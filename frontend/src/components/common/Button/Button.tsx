import { Button as HeadlessButton } from "@headlessui/react";
import type { FC } from "react";
import styles from "./Button.module.scss";

interface Props {
  label: string;
  onClick: () => void;
}

export const Button: FC<Props> = ({ label, onClick }) => {
  return (
    <HeadlessButton className={styles.button} onClick={onClick}>
      {label}
    </HeadlessButton>
  );
};
