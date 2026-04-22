import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export function PageMotion({ children, className = '' }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}
