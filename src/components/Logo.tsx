import { motion } from "framer-motion";

interface LogoProps {
  variant?: "icon" | "horizontal" | "stacked";
  className?: string;
  size?: number;
}

export const Logo = ({ variant = "horizontal", className = "", size = 40 }: LogoProps) => {
  const iconWidth = size * 2.2;
  const iconHeight = size;

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.6,
        ease: "easeInOut" as any,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 1.2,
        duration: 0.5,
        ease: "easeOut" as any,
      },
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.4,
        ease: "easeOut" as any,
      },
    },
  };

  const logoIcon = (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 110 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      {/* Background glow behind the monogram */}
      <motion.path
        d="M 45 18 L 20 18 L 20 30 L 45 30 L 45 42 L 20 42 M 52 18 L 64 42 L 76 18 L 88 42 L 100 18"
        stroke="#2563EB"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40 blur-sm"
        initial="hidden"
        animate="visible"
        variants={pathVariants}
      />
      {/* Main monogram path */}
      <motion.path
        d="M 45 18 L 20 18 L 20 30 L 45 30 L 45 42 L 20 42 M 52 18 L 64 42 L 76 18 L 88 42 L 100 18"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        animate="visible"
        variants={pathVariants}
      />
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex ${className}`}>{logoIcon}</div>;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="mb-2 text-white">{logoIcon}</div>
        <motion.div initial="hidden" animate="visible" variants={textVariants}>
          <span className="font-sans font-bold text-2xl tracking-tight text-white">SuperWeb</span>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={taglineVariants}
          className="font-sans text-[10px] tracking-[0.25em] text-muted-foreground uppercase mt-1"
        >
          We Build. You Grow.
        </motion.div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="text-white shrink-0">{logoIcon}</div>
      <div className="flex flex-col justify-center">
        <motion.span
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="font-sans font-bold text-xl leading-none tracking-tight text-white"
        >
          SuperWeb
        </motion.span>
        <motion.span
          initial="hidden"
          animate="visible"
          variants={taglineVariants}
          className="font-sans text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-1 leading-none"
        >
          We Build. You Grow.
        </motion.span>
      </div>
    </div>
  );
};

export default Logo;
