import type { Variants } from 'framer-motion'

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
