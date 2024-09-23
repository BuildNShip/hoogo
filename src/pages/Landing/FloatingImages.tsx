import { useEffect, useState } from "react";
import styles from "./Landing.module.css";

const FloatingImages = () => {
  const images = [
    "/public/1.png",
    "/public/2.png",
    "/public/3.png",
    "/public/7.png",
    "/public/8.png",
    "/public/9.png",
  ];
  interface ImagePosition {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
  }

  const [imagePositions, setImagePositions] = useState<ImagePosition[]>([]);

  useEffect(() => {
    const newPositions = images.map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
    }));
    setImagePositions(newPositions);

    const moveImages = () => {
      setImagePositions((prevPositions) =>
        prevPositions.map((pos) => ({
          x: (pos.x + pos.speedX + 100) % 100,
          y: (pos.y + pos.speedY + 100) % 100,
          speedX: pos.speedX,
          speedY: pos.speedY,
        }))
      );
    };

    const intervalId = setInterval(moveImages, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.floatingImages}>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Floating image ${index + 1}`}
          className={styles.floatingImage}
          style={{
            left: `${imagePositions[index]?.x || 0}%`,
            top: `${imagePositions[index]?.y || 0}%`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingImages;
