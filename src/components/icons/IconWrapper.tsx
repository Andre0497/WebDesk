import { motion, useReducedMotion } from 'framer-motion'
import { iconBgVariants, iconVariants } from '../../utils/animations'

interface IconWrapperProps {
  children: React.ReactNode
  onDoubleClick?: () => void
  onContextMenu?: (e: React.MouseEvent) => void
  isDragging?: boolean
}

export function IconWrapper({
  children,
  onDoubleClick,
  onContextMenu,
  isDragging = false,
}: IconWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  const disableGestures = isDragging || !!shouldReduceMotion

  return (
    <motion.div
      className="relative flex flex-col items-center p-2 rounded-xl select-none"
      whileHover={disableGestures ? undefined : 'hover'}
      whileTap={disableGestures ? undefined : 'tap'}
      initial="rest"
      animate="rest"
      variants={iconVariants}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        variants={iconBgVariants}
      />
      {children}
    </motion.div>
  )
}
