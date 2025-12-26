import { motion } from 'framer-motion';

const DraggableItem = ({ children, initialX, initialY, className = "", constraintsRef }) => (
    <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        initial={{ x: 0, y: 0 }}
        className={`absolute cursor-move z-20 hover:z-30 ${className}`}
        style={{ left: initialX, top: initialY }}
    >
        {children}
    </motion.div>
);

export default DraggableItem;
