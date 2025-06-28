import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, Box, Float, Environment, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform, useMotionValue, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import './App.css';

// 3D Components
const AnimatedSphere = ({ position, color, size = 0.5 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <Sphere ref={meshRef} position={position} args={[size, 32, 32]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Sphere>
    </Float>
  );
};

const SkillOrb = ({ position, skill, color }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
        <Sphere
          ref={meshRef}
          args={[0.8, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </Sphere>
        <Text
          position={[0, 0, 0.9]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {skill}
        </Text>
      </Float>
    </group>
  );
};

const Card3D = ({ position, title, content, color, width = 2, height = 2.5, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const meshRef = useRef();

  // Parallax effect on pointer move
  const handlePointerMove = (e) => {
    if (!meshRef.current) return;
    const x = e.point.x;
    const y = e.point.y;
    // Clamp and scale for dramatic effect
    const maxTilt = 0.35; // radians (~20deg)
    const rx = Math.max(Math.min(-y * 0.5, maxTilt), -maxTilt);
    const ry = Math.max(Math.min(x * 0.5, maxTilt), -maxTilt);
    setRotation([rx, ry, 0]);
  };

  // Reset on pointer out
  const handlePointerOut = () => {
    setHovered(false);
    setRotation([0, 0, 0]);
  };

  useFrame(() => {
    if (meshRef.current) {
      // Smoothly interpolate to target rotation
      meshRef.current.rotation.x += (rotation[0] - meshRef.current.rotation.x) * 0.15;
      meshRef.current.rotation.y += (rotation[1] - meshRef.current.rotation.y) * 0.15;
      meshRef.current.scale.setScalar(hovered ? 1.08 : 1);
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.7} floatIntensity={0.4}>
        <Box
          ref={meshRef}
          args={[width, height, 0.1]}
          onPointerOver={() => setHovered(true)}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
        >
          <meshStandardMaterial 
            color={hovered ? color : "#1e293b"} 
            metalness={0.9} 
            roughness={0.18} 
            emissive={hovered ? color : "#000"}
            emissiveIntensity={hovered ? 0.25 : 0}
          />
        </Box>
        <group position={[0, height/3, 0.1]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.15}
            color={color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {title}
          </Text>
          <Html
            position={[0, -0.5, 0]}
            center
            distanceFactor={8}
          >
            <div className="text-sm text-gray-300 w-32 text-center">
              {content}
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
};

const ProjectCard3D = ({ position, project, index }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.05;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        <Box
          ref={meshRef}
          args={[2, 2.5, 0.1]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={hovered ? "#4f46e5" : "#1e293b"} 
            metalness={0.8} 
            roughness={0.2} 
          />
        </Box>
        <Text
          position={[0, 0.8, 0.1]}
          fontSize={0.15}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {project.title}
        </Text>
        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          font="/fonts/Inter-Regular.woff"
        >
          {project.description}
        </Text>
        <Text
          position={[0, -0.3, 0.1]}
          fontSize={0.06}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {project.tech}
        </Text>
      </Float>
    </group>
  );
};

const Scene3D = ({ section }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    switch(section) {
      case 'hero':
        camera.position.set(0, 0, 5);
        break;
      case 'about':
        camera.position.set(2, 1, 4);
        break;
      case 'skills':
        camera.position.set(0, 2, 6);
        break;
      case 'projects':
        camera.position.set(0, 0, 8);
        break;
      default:
        camera.position.set(0, 0, 5);
    }
  }, [section, camera]);

  const skills = [
    { name: 'React.js', color: '#61dafb', position: [-3, 2, 0] },
    { name: 'Node.js', color: '#68a063', position: [3, 2, 0] },
    { name: 'Python', color: '#3776ab', position: [-3, -2, 0] },
    { name: 'JavaScript', color: '#f7df1e', position: [3, -2, 0] },
    { name: 'MongoDB', color: '#47a248', position: [0, 2, -2] },
    { name: 'C++', color: '#00599c', position: [0, -2, -2] },
  ];

  const projects = [
    {
      title: 'Coffee House',
      description: 'React Native app for coffee ordering with TypeScript',
      tech: 'React Native, TypeScript, CSS',
      position: [-4, 0, 0]
    },
    {
      title: 'Byte Builder',
      description: 'Real-time coding platform with live execution',
      tech: 'React.js, Node.js, Firebase, Socket.io',
      position: [0, 0, 0]
    },
    {
      title: 'Ecommerce Site',
      description: 'Modern responsive ecommerce with full features',
      tech: 'React.js, Vite, Tailwind CSS',
      position: [4, 0, 0]
    }
  ];

  return (
    <>
      <Environment preset="night" />
      <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} fade />
      
      {section === 'hero' && (
        <>
          <AnimatedSphere position={[-3, 2, -2]} color="#4f46e5" size={0.8} />
          <AnimatedSphere position={[3, -2, -3]} color="#06b6d4" size={0.6} />
          <AnimatedSphere position={[0, 3, -4]} color="#10b981" size={0.4} />
          <Text
            position={[0, 0, 0]}
            fontSize={0.8}
            color="#60a5fa"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            ADITYA CHAUDHARY
          </Text>
          <Text
            position={[0, -1, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Regular.woff"
          >
            Full Stack Developer
          </Text>
        </>
      )}

      {section === 'skills' && (
        <>
          {skills.map((skill, index) => (
            <SkillOrb
              key={skill.name}
              position={skill.position}
              skill={skill.name}
              color={skill.color}
            />
          ))}
        </>
      )}

      {section === 'projects' && (
        <></>
      )}

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

// 1. 3D tilt effect for Education and Experience cards
function useParallaxTilt(shadowColor = 'rgba(96,165,250,0.18)') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `rotateY(${x / 12}deg) rotateX(${-y / 14}deg) scale(1.04)`;
      el.style.boxShadow = `0px 8px 32px 0px ${shadowColor}`;
    };
    const handleMouseLeave = () => {
      el.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
      el.style.boxShadow = '';
    };
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [shadowColor]);
  return ref;
}

// Main App Component
const App = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3 });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.3 });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.3 });

  // Mouse position for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [25, -25]);
  const rotateY = useTransform(x, [-150, 150], [-25, 25]);

  // Custom cursor effect
  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      
      // Check if target is an interactive element
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest?.('a') || 
        target.closest?.('button') ||
        target.closest?.('input') ||
        target.closest?.('textarea');

      if (isInteractive) {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest?.('input') || target.closest?.('textarea')) {
          setCursorVariant('text');
        } else {
          setCursorVariant('hover');
        }
      } else {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (heroInView) setCurrentSection('hero');
    else if (aboutInView) setCurrentSection('about');
    else if (skillsInView) setCurrentSection('skills');
    else if (projectsInView) setCurrentSection('projects');
  }, [heroInView, aboutInView, skillsInView, projectsInView]);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const xPos = (clientX - left) / width;
    const yPos = (clientY - top) / height;
    x.set((xPos - 0.5) * 300);
    y.set((yPos - 0.5) * 300);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Place all hooks at the top of the component
  const eduTilt = useParallaxTilt('rgba(96,165,250,0.28)');
  const expTilt = useParallaxTilt('rgba(52,211,153,0.28)');

  // Profile image floating/orbit animation + pulse
  const [orbit, setOrbit] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOrbit(o => o + 0.018), 16);
    return () => clearInterval(id);
  }, []);
  const orbitX = Math.sin(orbit) * 14;
  const orbitY = Math.cos(orbit) * 10;
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 });
  const handleImgMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setImgTilt({ x: x / 18, y: -y / 18 });
  };
  const handleImgMouseLeave = () => setImgTilt({ x: 0, y: 0 });
  // Pulse animation for border
  const imgControls = useAnimation();
  useEffect(() => {
    imgControls.start({
      boxShadow: [
        '0 0 0 0 rgba(124,58,237,0.5)',
        '0 0 0 12px rgba(59,130,246,0.15)',
        '0 0 0 0 rgba(124,58,237,0.5)'
      ],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
    });
  }, [imgControls]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Custom Cursor */}
      <motion.div
        className={`custom-cursor ${cursorVariant === 'hover' ? 'cursor-hover' : ''} ${cursorVariant === 'click' ? 'cursor-click' : ''} ${cursorVariant === 'text' ? 'cursor-text' : ''}`}
        animate={{
          x: cursorPosition.x - 10,
          y: cursorPosition.y - 10,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="cursor-dot"
        animate={{
          x: cursorPosition.x - 2,
          y: cursorPosition.y - 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene3D section={currentSection} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 bg-black bg-opacity-50">
        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
          {/* Interactive background pattern */}
          <motion.div
            className="absolute inset-0 pointer-events-none interactive-bg"
            animate={{
              backgroundPosition: [
                "0% 0%",
                "100% 100%",
                "50% 50%",
                "0% 0%"
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;
              e.currentTarget.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
            }}
          />

          {/* Floating particles background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-8"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, Math.random() * 8 - 4, 0],
                  opacity: [0.08, 0.2, 0.08],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl relative z-10"
          >
            {/* Animated Name with Enhanced Effects */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            >
              {/* Main text with enhanced gradient and typing effect */}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x relative z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                style={{ display: "inline-block", overflow: "hidden" }}
              >
                <motion.span
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                >
                  ADITYA CHAUDHARY
                </motion.span>
              </motion.span>

              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full"
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </motion.h1>

            {/* Enhanced Animated Title */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 relative z-10 flex flex-wrap items-center justify-center gap-2"
              >
                <motion.span 
                  className="text-blue-400 font-semibold"
                  initial={{ width: 0, overflow: "hidden" }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
                >
                  <motion.span
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
                  >
                    Full Stack Developer
                  </motion.span>
                </motion.span>
                <span className="text-gray-500">|</span>
                <motion.span 
                  className="text-blue-400 font-semibold"
                  initial={{ width: 0, overflow: "hidden" }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1.5, delay: 3.5, ease: "easeOut" }}
                >
                  <motion.span
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.5, delay: 3.5, ease: "easeOut" }}
                  >
                    Problem Solver
                  </motion.span>
                </motion.span>
                <span className="text-gray-500">|</span>
                <motion.span 
                  className="text-cyan-400 font-semibold"
                  initial={{ width: 0, overflow: "hidden" }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1.5, delay: 4.5, ease: "easeOut" }}
                >
                  <motion.span
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.5, delay: 4.5, ease: "easeOut" }}
                  >
                    Tech Enthusiast
                  </motion.span>
                </motion.span>
              </motion.p>
              
              {/* Enhanced floating particles effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.div
                className="bg-blue-600 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white flex items-center gap-2">
                  📍 Bangalore, Karnataka
                </span>
              </motion.div>
              <motion.div
                className="bg-blue-600 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white flex items-center gap-2">
                  🎓 B.Tech CSE
                </span>
              </motion.div>
              <motion.div
                className="bg-cyan-600 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white flex items-center gap-2">
                  💼 Open to Work
                </span>
              </motion.div>
            </div>
            
            {/* Resume Download Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="mb-8"
            >
              <motion.a
                href="/Cv_Aditya_Chaudhary_2025.pdf"
                download
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </motion.a>
            </motion.div>
            <div className="flex justify-center space-x-6">
              <motion.a
                href="mailto:aditya0002adi@gmail.com"
                className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-full flex items-center gap-2 magnetic-hover glass-effect shadow-lg"
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(59, 130, 246, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.setProperty('--mouse-x', `${x * 0.1}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y * 0.1}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', '0px');
                  e.currentTarget.style.setProperty('--mouse-y', '0px');
                }}
              >
                📧 Contact Me
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/adityachaudhary0/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 rounded-full flex items-center gap-2 magnetic-hover glass-effect shadow-lg"
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(29, 78, 216, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.setProperty('--mouse-x', `${x * 0.1}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y * 0.1}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', '0px');
                  e.currentTarget.style.setProperty('--mouse-y', '0px');
                }}
              >
                💼 LinkedIn
              </motion.a>
              <motion.a
                href="https://github.com/AdityaChaudhary0002"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-3 rounded-full flex items-center gap-2 magnetic-hover glass-effect shadow-lg"
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(31, 41, 55, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.setProperty('--mouse-x', `${x * 0.1}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y * 0.1}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', '0px');
                  e.currentTarget.style.setProperty('--mouse-y', '0px');
                }}
              >
                💻 GitHub
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            {/* Left: About, Education, Experience */}
            <div className="flex flex-col gap-8">
              <div className="mb-2">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400">About Me</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  I'm a passionate Full Stack Developer with a strong foundation in Computer Science and Engineering. With expertise in modern web technologies and a competitive programming background, I build scalable and efficient solutions.
                </p>
              </div>
              {/* Education Card: simple, clean, modern, with B.Tech, 12th, 10th */}
              <div
                className="bg-gray-800 p-6 rounded-xl shadow-lg mb-4 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(96,165,250,0.18)]"
              >
                <div className="flex items-center mb-3">
                  <svg className="w-8 h-8 mr-3 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L2 9l10 6 10-6-10-6zm0 13c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" fill="#60a5fa"/>
                  </svg>
                  <h3 className="text-xl font-bold text-blue-400">Education</h3>
                </div>
                <div className="space-y-3">
                  {/* B.Tech */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 9l10 6 10-6-10-6zm0 13c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" fill="#60a5fa"/></svg>
                    <span className="font-semibold text-gray-200">B.Tech CSE</span>
                    <span className="text-xs text-blue-400 font-bold">7.24/10 CGPA</span>
                  </div>
                  <div className="pl-7 text-sm text-gray-400">Lovely Professional University, Jalandhar Punjab</div>
                  {/* 12th */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="7" rx="2" fill="#34d399"/><rect x="7" y="7" width="10" height="4" rx="1" fill="#34d399"/><rect x="9" y="3" width="6" height="4" rx="1" fill="#34d399"/></svg>
                    <span className="font-semibold text-gray-200">12th</span>
                    <span className="text-xs text-green-400 font-bold">88%</span>
                  </div>
                  <div className="pl-7 text-sm text-gray-400">Saint Vivekananda Sr. Sec. Public School, Etawah Uttar Pradesh</div>
                  {/* 10th */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="7" rx="2" fill="#fbbf24"/><rect x="7" y="7" width="10" height="4" rx="1" fill="#fbbf24"/><rect x="9" y="3" width="6" height="4" rx="1" fill="#fbbf24"/></svg>
                    <span className="font-semibold text-gray-200">10th</span>
                    <span className="text-xs text-yellow-400 font-bold">10/10 CGPA</span>
                  </div>
                  <div className="pl-7 text-sm text-gray-400">Saint Vivekananda Sr. Sec. Public School, Etawah Uttar Pradesh</div>
                </div>
              </div>
              {/* Experience Card: simple, clean, modern */}
              <div
                className="bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(52,211,153,0.18)]"
              >
                <div className="flex items-center mb-3">
                  <svg className="w-8 h-8 mr-3 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="7" width="16" height="13" rx="2" fill="#34d399"/>
                    <rect x="9" y="3" width="6" height="4" rx="1" fill="#34d399"/>
                  </svg>
                  <h3 className="text-xl font-bold text-green-400">Experience</h3>
                </div>
                <div>
                  <p className="text-base text-gray-300 font-semibold">Open to Opportunities</p>
                  <p className="text-sm text-gray-400">Exploring new challenges</p>
                </div>
              </div>
            </div>

            {/* Right: Profile Photo + Quick Stats */}
            <div className="flex flex-col items-center gap-8">
              {/* Profile Photo with 3D tilt/hover (true 3D effect) */}
              <motion.div
                className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1 shadow-lg flex items-center justify-center"
                style={{
                  perspective: '800px',
                  transform: `translateX(${orbitX}px) translateY(${orbitY}px) rotateY(${imgTilt.x}deg) rotateX(${imgTilt.y}deg)`
                }}
                onMouseMove={handleImgMouseMove}
                onMouseLeave={handleImgMouseLeave}
                whileHover={{ scale: 1.08, boxShadow: '0px 12px 32px 0px rgba(96,165,250,0.4)' }}
                animate={imgControls}
              >
                <img
                  src="/profile.jpg"
                  alt="Aditya Chaudhary"
                  className="w-full h-full rounded-full object-cover"
                  style={{ transform: 'translateZ(20px) scale(0.96)', transformStyle: 'preserve-3d' }}
                />
              </motion.div>
              {/* Quick Stats with icons */}
              <div
                className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(168,85,247,0.18)]"
              >
                <div className="flex items-center mb-6">
                  <img src="https://www.svgrepo.com/show/143589/chart.svg" alt="Quick Stats" className="w-10 h-10 mr-3" style={{ filter: 'invert(75%) sepia(50%) saturate(1500%) hue-rotate(240deg)' }} />
                  <h3 className="text-2xl font-bold text-purple-400">Quick Stats</h3>
                </div>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-3">
                      <img src="https://www.svgrepo.com/show/474334/coding.svg" alt="Projects" className="w-6 h-6" />
                      <span className="font-medium">Projects Completed</span>
                    </span>
                    <span className="font-bold text-blue-300 text-lg">15+</span>
                  </li>
                  <li className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-3">
                      <img src="https://www.svgrepo.com/show/4087/web-development.svg" alt="Problems" className="w-6 h-6" />
                      <span className="font-medium">Problems Solved</span>
                    </span>
                    <span className="font-bold text-green-300 text-lg">1500+</span>
                  </li>
                  <li className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-3">
                      {/* LeetCode SVG icon for visibility */}
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <path d="M25.5 16.1c0-2.2-1.1-4.2-2.9-5.4l-6.2-4.2c-1.1-.7-2.5-.7-3.6 0l-6.2 4.2C7.6 11.9 6.5 13.9 6.5 16.1v7.8c0 1.2.7 2.3 1.8 2.9l6.2 4.2c1.1.7 2.5.7 3.6 0l6.2-4.2c1.1-.7 1.8-1.8 1.8-2.9v-7.8z" fill="#FFA116"/>
                          <path d="M16 2.5c-1.1 0-2 .9-2 2v7.2c0 1.1.9 2 2 2s2-.9 2-2V4.5c0-1.1-.9-2-2-2z" fill="#292D3E"/>
                        </g>
                      </svg>
                      <span className="font-medium">Max LeetCode Rating</span>
                    </span>
                    <span className="font-bold text-purple-300 text-lg">1805</span>
                  </li>
                  <li className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-3">
                      <img src="https://www.svgrepo.com/show/143589/chart.svg" alt="Certifications" className="w-6 h-6" />
                      <span className="font-medium">Certifications</span>
                    </span>
                    <span className="font-bold text-yellow-300 text-lg">5+</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section ref={skillsRef} className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Technical Skills</h2>
              <p className="text-lg text-gray-300">A look at the technologies I work with.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Programming */}
              <motion.div 
                className="bg-gray-800 rounded-lg p-6 text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, scale: 1.05, rotateY: 5, boxShadow: '0px 20px 40px rgba(96, 165, 250, 0.4)' }}
                transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 300 }}
              >
                <motion.div className="flex justify-center items-center mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <img src="https://www.svgrepo.com/show/474334/coding.svg" alt="Programming icon" className="w-16 h-16" style={{ filter: 'invert(1)' }}/>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Programming</h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Python</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">C++</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">JavaScript</span>
                  </div>
                </div>
              </motion.div>
              {/* Web Development */}
              <motion.div 
                className="bg-gray-800 rounded-lg p-6 text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, scale: 1.05, rotateY: 5, boxShadow: '0px 20px 40px rgba(52, 211, 153, 0.4)' }}
                transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <motion.div className="flex justify-center items-center mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <img src="https://www.svgrepo.com/show/4087/web-development.svg" alt="Web Dev icon" className="w-16 h-16" style={{ filter: 'invert(1)' }}/>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Web Development</h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React.js" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">React.js</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Node.js</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Express.js</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Tailwind CSS</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Native" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">React Native</span>
                  </div>
                </div>
              </motion.div>
              {/* Databases */}
              <motion.div 
                className="bg-gray-800 rounded-lg p-6 text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, scale: 1.05, rotateY: 5, boxShadow: '0px 20px 40px rgba(168, 85, 247, 0.4)' }}
                transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 300 }}
              >
                <motion.div className="flex justify-center items-center mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <img src="https://www.svgrepo.com/show/499816/database.svg" alt="Database icon" className="w-16 h-16" style={{ filter: 'invert(1)' }}/>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Databases</h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">MongoDB</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">MySQL</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Firebase</span>
                  </div>
                </div>
              </motion.div>
              {/* Tools & Tech */}
              <motion.div 
                className="bg-gray-800 rounded-lg p-6 text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, scale: 1.05, rotateY: 5, boxShadow: '0px 20px 40px rgba(245, 158, 11, 0.4)' }}
                transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 300 }}
              >
                <motion.div className="flex justify-center items-center mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <img src="https://www.svgrepo.com/show/155193/wrench-and-screwdriver.svg" alt="Tools icon" className="w-16 h-16" style={{ filter: 'invert(1)' }}/>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Tools & Tech</h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Git</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Docker</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Figma</span>
                  </div>
                  <div className="flex items-start justify-start gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" alt="Linux" className="w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-300">Linux</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={projectsRef} className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Featured Projects</h2>
              <p className="text-lg text-gray-300">Here are some of my recent works</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* E-commerce Website Card */}
              <motion.div 
                className="project-card-container border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-blue-400"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop)' }}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ 
                  rotateY: 5, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="project-card-content">
                  <motion.h3 
                    className="text-2xl font-bold mb-4 text-blue-400"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    E-commerce Website
                  </motion.h3>
                  <p className="text-gray-200 mb-4">A sleek and responsive e-commerce site with modern design, built with React and Vite for a fast, seamless user shopping experience.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['React.js', 'Vite', 'Tailwind CSS'].map((tech, index) => (
                      <motion.span 
                        key={tech} 
                        className="bg-blue-800 bg-opacity-80 px-2 py-1 rounded text-xs"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <motion.a 
                      href="https://e-commercccceee.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🚀 Live Demo
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Byte Builder Card */}
              <motion.div 
                className="project-card-container border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-green-400"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop)' }}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ 
                  rotateY: 5, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="project-card-content">
                  <motion.h3 
                    className="text-2xl font-bold mb-4 text-green-400"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Byte Builder
                  </motion.h3>
                  <p className="text-gray-200 mb-4">A real-time coding platform with live code execution, Firebase auth, and community features for collaborative and interactive learning.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['React.js', 'Node.js', 'Firebase', 'Socket.io'].map((tech, index) => (
                      <motion.span 
                        key={tech} 
                        className="bg-green-800 bg-opacity-80 px-2 py-1 rounded text-xs"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <motion.a 
                      href="https://code-editor-6rqa.onrender.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🚀 Live Demo
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Coffee House Card */}
              <motion.div 
                className="project-card-container border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-purple-400"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop)' }}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ 
                  rotateY: 5, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="project-card-content">
                  <motion.h3 
                    className="text-2xl font-bold mb-4 text-purple-400"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Coffee House
                  </motion.h3>
                  <p className="text-gray-200 mb-4">A mobile-first coffee ordering application built with React Native and TypeScript, focusing on a clean UI and intuitive user workflow.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['React Native', 'TypeScript', 'CSS'].map((tech, index) => (
                      <motion.span 
                        key={tech} 
                        className="bg-purple-800 bg-opacity-80 px-2 py-1 rounded text-xs"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <motion.a 
                      href="https://drive.google.com/drive/folders/1JZ0EL0VH1ZSPS8PKMU23dUBty4GjWzK9" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      📁 View Files
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Achievements</h2>
              <p className="text-lg text-gray-300">Competitive Programming Excellence</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { platform: 'LeetCode', rating: '1805', rank: 'Top 7%', color: 'orange', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.12.0/leetcode.svg', url: 'https://leetcode.com/u/openair/' },
                { platform: 'CodeChef', rating: '1650', rank: '3-Star', color: 'amber', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.12.0/codechef.svg', url: 'https://www.codechef.com/users/openair_30' },
                { platform: 'Codeforces', rating: '1278', rank: 'Pupil', color: 'blue', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.12.0/codeforces.svg', url: 'https://codeforces.com/profile/openair' },
                { platform: 'GeeksforGeeks', rating: '1363', rank: 'Active', color: 'green', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.12.0/geeksforgeeks.svg', url: 'https://www.geeksforgeeks.org/user/openair/' },
              ].map((achievement) => (
                <motion.div
                  key={achievement.platform}
                  whileHover={{
                    scale: 1.08,
                    y: -12,
                    rotate: 2,
                    boxShadow: `0 25px 50px -12px ${
                      achievement.color === 'orange' ? 'rgba(251, 146, 60, 0.4)' :
                      achievement.color === 'amber' ? 'rgba(245, 158, 11, 0.4)' :
                      achievement.color === 'blue' ? 'rgba(96, 165, 250, 0.4)' :
                      'rgba(52, 211, 153, 0.4)'
                    }`
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 text-center cursor-pointer"
                  onClick={() => window.open(achievement.url, '_blank')}
                >
                  <div className="flex justify-center items-center h-16 mb-4">
                    <img src={achievement.iconUrl} alt={`${achievement.platform} logo`} className="max-h-full max-w-full" />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${
                    achievement.color === 'orange' ? 'text-orange-400' :
                    achievement.color === 'amber' ? 'text-amber-400' :
                    achievement.color === 'blue' ? 'text-blue-400' :
                    'text-green-400'
                  }`}>
                    {achievement.rating}
                  </div>
                  <div className="text-lg font-semibold mb-1">{achievement.platform}</div>
                  <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                    {achievement.rank.includes('Top') && (
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                    {achievement.rank.includes('Star') && (
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                    {achievement.rank.includes('Pupil') && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                    {achievement.rank.includes('Active') && (
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                    {achievement.rank}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8">
                <h3 className="text-3xl font-bold mb-4">1500+ Problems Solved</h3>
                <p className="text-lg text-gray-200">Across all competitive programming platforms</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Certifications</h2>
              <p className="text-lg text-gray-300">Professional credentials and continuous learning achievements</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "React.js Development",
                  issuer: "Coursera",
                  date: "2024",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                  color: "blue",
                  delay: 0.1
                },
                {
                  title: "Node.js Backend Development",
                  issuer: "Udemy",
                  date: "2024",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
                  color: "green",
                  delay: 0.2
                },
                {
                  title: "MongoDB Database Design",
                  issuer: "MongoDB University",
                  date: "2024",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
                  color: "green",
                  delay: 0.3
                },
                {
                  title: "Python Programming",
                  issuer: "Coursera",
                  date: "2023",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                  color: "yellow",
                  delay: 0.4
                },
                {
                  title: "Git & GitHub",
                  issuer: "GitHub",
                  date: "2023",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
                  color: "gray",
                  delay: 0.5
                },
                {
                  title: "Web Development Fundamentals",
                  issuer: "freeCodeCamp",
                  date: "2023",
                  icon: "https://www.svgrepo.com/show/4087/web-development.svg",
                  color: "purple",
                  delay: 0.6
                }
              ].map((cert, index) => (
                <motion.div 
                  key={cert.title}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: `0px 20px 40px ${
                      cert.color === 'blue' ? 'rgba(96, 165, 250, 0.4)' :
                      cert.color === 'green' ? 'rgba(52, 211, 153, 0.4)' :
                      cert.color === 'yellow' ? 'rgba(245, 158, 11, 0.4)' :
                      cert.color === 'gray' ? 'rgba(107, 114, 128, 0.4)' :
                      'rgba(168, 85, 247, 0.4)'
                    }`
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: cert.delay,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="bg-gray-800 rounded-lg p-6 text-center relative overflow-hidden group border border-gray-700"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="flex justify-center items-center mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img src={cert.icon} alt={`${cert.title} icon`} className="w-16 h-16" style={{ filter: 'invert(1)' }}/>
                    </motion.div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      cert.color === 'blue' ? 'text-blue-400' :
                      cert.color === 'green' ? 'text-green-400' :
                      cert.color === 'yellow' ? 'text-yellow-400' :
                      cert.color === 'gray' ? 'text-gray-400' :
                      'text-purple-400'
                    }`}>{cert.title}</h3>
                    <p className="text-gray-300 mb-1">{cert.issuer}</p>
                    <p className="text-sm text-gray-400">{cert.date}</p>
                    
                    {/* Verification badge */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-300">Verified</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="min-h-screen flex items-center px-4 py-20 bg-black/80">
          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              className="bg-gray-900 rounded-xl p-8 border border-gray-800 flex flex-col justify-between shadow-2xl"
              whileHover={{ y: -10, scale: 1.04, rotateY: 6, boxShadow: '0 12px 40px 0 rgba(59,130,246,0.25)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✉️</span>
                    <span className="text-gray-300">aditya0002adi@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <span className="text-gray-300">+91 7453875563</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <span className="text-gray-300">Bengaluru, Karnataka</span>
                  </div>
                </div>
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-200 mb-2">Follow Me</h4>
                  <div className="flex gap-4">
                    <a href="https://www.linkedin.com/in/adityachaudhary0/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                    </a>
                    <a href="https://github.com/AdityaChaudhary0002" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 mt-4 shadow-xl border border-blue-700/30">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Open for Opportunities</h4>
                  <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
                    <li>Full-Stack Developer</li>
                    <li>Software Development Engineer</li>
                    <li>Open Source</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            {/* Contact Form (static) */}
            <motion.div
              className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-2xl"
              whileHover={{ y: -10, scale: 1.04, rotateY: -6, boxShadow: '0 12px 40px 0 rgba(168,85,247,0.25)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Send a Message</h3>
              <p className="text-gray-400 mb-6">Tell me about your project, collaboration idea, or just drop a hello.</p>
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const data = {
                  name: form.elements[0].value,
                  email: form.elements[1].value,
                  message: form.elements[2].value
                };
                const res = await fetch('https://formspree.io/f/manjalpg', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: data.message
                  })
                });
                if (res.ok) {
                  alert('Thank you! Your message has been sent.');
                  form.reset();
                } else {
                  alert('Sorry, there was an error. Please try again later.');
                }
              }}>
                <div className="flex gap-4">
                  <input type="text" placeholder="Full Name" className="w-1/2 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  <input type="email" placeholder="Email Address" className="w-1/2 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <textarea placeholder="Describe your project, ask a question, or just say hello..." rows="5" className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all">Send Message</button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Inspirational Quote Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Quote marks */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <svg className="w-16 h-16 text-blue-400 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              
              {/* Main quote */}
              <blockquote className="text-3xl md:text-4xl font-bold text-white mb-6 leading-relaxed">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  "Code is like humor. When you have to explain it, it's bad."
                </span>
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <p className="text-lg text-gray-300">Cory House</p>
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
                <span className="text-gray-400">© 2025 Aditya Chaudhary. All rights reserved.</span>
                <span className="text-gray-500 hidden md:inline">•</span>
                <span className="text-gray-400">Built with</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-semibold">React</span>
                  <span className="text-gray-500">and</span>
                  <span className="text-cyan-400 font-semibold">Tailwind CSS</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <span>Powered by </span>
                <span className="text-purple-400 font-semibold">Three.js</span>
                <span> and </span>
                <span className="text-green-400 font-semibold">Framer Motion</span>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;