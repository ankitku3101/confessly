"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { CSSProperties } from "react";

type ComicTextProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: number;
};

export function ComicText({
  children,
  className,
  style,
  fontSize = 2,
}: ComicTextProps) {
  if (typeof children !== "string") {
    throw new Error("children must be a string");
  }

  const dotColor = "#EF4444";
  const backgroundColor = "#FACC15";

  return (
    <motion.div
      className={cn("select-none text-center", className)}
      style={{
        fontFamily: "'Bangers', 'Comic Sans MS', 'Impact', sans-serif",
        fontWeight: "600",
        WebkitTextStroke: `${fontSize * 0.1}px #000000`,
        transform: "skewX(-10deg)",
        textTransform: "uppercase",
        filter: `
          drop-shadow(2px 2px 0px #000000)
          drop-shadow(0px 1px 0px ${dotColor})
        `,
        backgroundColor: backgroundColor,
        backgroundSize: "8px 8px",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.175, 0.885, 0.32, 1.275],
        type: "spring",
      }}
    >
      {children}
    </motion.div>
  );
}
