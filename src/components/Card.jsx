import { motion } from 'framer-motion'
export default function Card({children,className=''}){return <motion.div whileHover={{y:-2}} transition={{type:'spring',stiffness:260,damping:22}} className={`glass rounded-[2rem] p-5 shadow-soft border border-white/60 ${className}`}>{children}</motion.div>}
