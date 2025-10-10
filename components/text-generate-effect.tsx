"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
}) => {
  const [scope, animate] = useAnimate();
  let lettersArray = words.split("");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.1, { start: delay }),
      }
    );
  }, [scope.current]);

  const renderLetters = () => {
    return (
      <motion.div ref={scope}>
        {lettersArray.map((letter, idx) => {
          return (
            <motion.span
              key={letter + idx}
              className="text-foreground opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {letter}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <span className={cn("inline-block", className)}>
      <div className="text-foreground leading-none">
        {renderLetters()}
      </div>
    </span>
  );
};
