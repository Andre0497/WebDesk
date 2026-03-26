import type { Variants } from 'framer-motion'

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
}

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
      mass: 0.8,
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
}

export const folderWindowVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 10,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
}

export const desktopGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06, // 60ms Delay pro Icon
      delayChildren: 0.1, // kurze Verzögerung nach App-Start
    },
  },
}

export const iconEnterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
}

export const iconVariants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.08,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 20,
    },
  },
}

export const iconBgVariants: Variants = {
  rest: {
    opacity: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  hover: {
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
}
