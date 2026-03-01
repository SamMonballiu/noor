import { useState, useEffect, type FC } from "react";
import { Input as HeadlessInput } from "@headlessui/react";
import styles from "./Input.module.scss";
import { FaSearch, FaTimes } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (val: string) => void;
  interval?: number;
}

export const Input: FC<Props> = ({ value, onChange, interval = 400 }) => {
  const [inputValue, setInputValue] = useState(value);

  let timer: number;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  useEffect(() => {
    clearTimeout(timer);

    // Set a new timer to update the state after the debounce interval
    timer = setTimeout(() => {
      onChange(inputValue);
    }, interval);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <section className={styles.wrapper}>
      <FaSearch />
      <HeadlessInput
        name="full_name"
        type="text"
        value={inputValue}
        className={styles.input}
        onChange={handleInputChange}
      />
      <FaTimes className={styles.clearIcon} onClick={() => setInputValue("")} />
    </section>
  );
};
