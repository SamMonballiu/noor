import { useRef, useState, type FC } from "react";
import styles from "./MainPage.module.scss";
import {
  FaList,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from "react-icons/fa";

export const MainPage: FC = () => {
  const [value, setValue] = useState(0.505);
  const [showQueue, setShowQueue] = useState(false);
  const ref = useRef<HTMLProgressElement | null>(null);

  return (
    <div className={styles.container}>
      <section className={styles.main}>
        <section className={styles.items}>items</section>
        <section className={styles.spotlight}>
          <div>
            <img src="http://raspberrypi:4004/cribs.jpg" />
            <div className={styles.info}>
              <span className={styles.track}>In Your Palace</span>
              <span className={styles.album}>24/7 Rock Star Shit</span>
              <span className={styles.artist}>The Cribs</span>
            </div>
          </div>
        </section>
        {showQueue && <section className={styles.queue}>queue</section>}
      </section>
      <section className={styles.bottom}>
        <section className={styles.progress}>
          <progress
            ref={ref}
            value={value}
            onClick={(e) => {
              setValue(e.clientX / (ref.current?.clientWidth ?? 1));
            }}
          />
        </section>

        <section className={styles.btm}>
          <section className={styles.playing}>
            <img
              className={styles.cover}
              src="http://raspberrypi:4004/cribs.jpg"
            />
            <div className={styles.info}>
              <span className={styles.track}>In Your Palace</span>
              <span className={styles.artist}>The Cribs</span>
            </div>
          </section>

          <section className={styles.controls}>
            <FaStepBackward />
            <FaPause className={styles.mainBtn} />
            <FaStepForward />
          </section>

          <section className={styles.options}>
            <FaVolumeUp />
            <input type="range" />
            <FaList onClick={() => setShowQueue(!showQueue)} />
          </section>
        </section>
      </section>
    </div>
  );
};
