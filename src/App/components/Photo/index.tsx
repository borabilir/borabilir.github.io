const Phone = () => {
    return (
        <div style={{ position: 'relative' }}>
            <img src="photo.png" alt="" />
            {/* <motion.svg
                style={{
                    width: 280,
                    height: 280,
                    position: 'absolute',
                    top: 5,
                    left: -4,
                }}
                fill="transparent"
                viewBox="0 0 560 560"
                xmlns="http://www.w3.org/0200/svg"
            >
                <motion.circle
                    cx="275"
                    cy="275"
                    r="268"
                    stroke="#5704ff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ strokeDasharray: '24 10 0 0' }}
                    animate={{
                        strokeDasharray: [
                            '15 120 25 25',
                            '16 25 92 72',
                            '4 250 22 22',
                        ],
                        rotate: [120, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                />
            </motion.svg> */}
        </div>
    );
};

export default Phone;
