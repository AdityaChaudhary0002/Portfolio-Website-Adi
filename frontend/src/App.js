import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, Box, Float, Environment, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
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

// Main App Component
const App = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3 });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.3 });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.3 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [25, -25]);
  const rotateY = useTransform(x, [-150, 150], [-25, 25]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (heroInView) setCurrentSection('hero');
    else if (aboutInView) setCurrentSection('about');
    else if (skillsInView) setCurrentSection('skills');
    else if (projectsInView) setCurrentSection('projects');
  }, [heroInView, aboutInView, skillsInView, projectsInView]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden">
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
        <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              ADITYA CHAUDHARY
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Full Stack Developer | Problem Solver | Tech Enthusiast
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.div
                className="bg-blue-600 px-4 py-2 rounded-full"
                whileHover={{ y: -4, scale: 1.1, boxShadow: '0px 10px 20px rgba(59, 130, 246, 0.3)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-sm font-semibold">📍 Bangalore, Karnataka</span>
              </motion.div>
              <motion.div
                className="bg-green-600 px-4 py-2 rounded-full"
                whileHover={{ y: -4, scale: 1.1, boxShadow: '0px 10px 20px rgba(34, 197, 94, 0.3)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-sm font-semibold">🎓 B.Tech CSE</span>
              </motion.div>
              <motion.div
                className="bg-purple-600 px-4 py-2 rounded-full"
                whileHover={{ y: -4, scale: 1.1, boxShadow: '0px 10px 20px rgba(168, 85, 247, 0.3)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-sm font-semibold">💼 Open to Work</span>
              </motion.div>
            </div>
            <div className="flex justify-center space-x-6">
              <motion.a
                href="mailto:aditya0002adi@gmail.com"
                className="bg-blue-600 px-6 py-3 rounded-lg flex items-center gap-2"
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(59, 130, 246, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                📧 Contact Me
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/adityachaudhary0/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2"
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(29, 78, 216, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                💼 LinkedIn
              </motion.a>
              <motion.a
                href="https://github.com/AdityaChaudhary0002"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 px-6 py-3 rounded-lg flex items-center gap-2"
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(31, 41, 55, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                💻 GitHub
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">About Me</h2>
                <p className="text-lg mb-6 text-gray-300 leading-relaxed">
                  I'm a passionate Full Stack Developer with a strong foundation in Computer Science and Engineering. 
                  With expertise in modern web technologies and a competitive programming background, I build scalable 
                  and efficient solutions.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg transition-transform duration-300 hover:scale-110 hover:-translate-y-4 hover:rotate-3 hover:shadow-[0_16px_48px_0_rgba(96,165,250,0.7)]">
                    <img src="https://www.svgrepo.com/show/1001/graduation-cap.svg" alt="Education" className="w-10 h-10 mx-auto mb-3" style={{ filter: 'invert(75%) sepia(50%) saturate(1500%) hue-rotate(180deg)' }} />
                    <h3 className="font-semibold text-blue-400 mb-2">Education</h3>
                    <p className="text-sm text-gray-300">B.Tech CSE - 7.24/10 CGPA</p>
                    <p className="text-xs text-gray-400">LPU, Jalandhar</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg transition-transform duration-300 hover:scale-110 hover:-translate-y-4 hover:-rotate-3 hover:shadow-[0_16px_48px_0_rgba(52,211,153,0.7)]">
                    <img src="https://www.svgrepo.com/show/376406/briefcase-line.svg" alt="Experience" className="w-10 h-10 mx-auto mb-3" style={{ filter: 'invert(75%) sepia(50%) saturate(600%) hue-rotate(90deg)' }} />
                    <h3 className="font-semibold text-green-400 mb-2">Experience</h3>
                    <p className="text-sm text-gray-300">Open to Opportunities</p>
                    <p className="text-xs text-gray-400">Exploring new challenges</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-6" style={{ perspective: '1000px' }}>
                  <motion.div
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1 mx-auto shadow-lg"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      rotateX,
                      rotateY,
                      transformStyle: 'preserve-3d',
                    }}
                    whileHover={{ scale: 1.1, boxShadow: '0px 20px 40px rgba(96, 165, 250, 0.5)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                  >
                    <motion.img
                      src="/profile.jpg"
                      alt="Aditya Chaudhary"
                      className="w-full h-full rounded-full object-cover"
                      style={{
                        transform: 'translateZ(30px) scale(0.9)',
                        transformStyle: 'preserve-3d',
                      }}
                    />
                  </motion.div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 w-80 mx-auto transition-transform duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(168,85,247,0.5)]">
                  <img src="https://www.svgrepo.com/show/143589/chart.svg" alt="Quick Stats" className="w-10 h-10 mx-auto mb-3" style={{ filter: 'invert(75%) sepia(50%) saturate(1500%) hue-rotate(240deg)' }} />
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Projects Completed</span>
                      </div>
                      <span className="text-blue-400 font-bold">3+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Problems Solved</span>
                      </div>
                      <span className="text-green-400 font-bold">1500+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Max LeetCode Rating</span>
                      </div>
                      <span className="text-purple-400 font-bold">1805</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Certifications</span>
                      </div>
                      <span className="text-yellow-400 font-bold">5+</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
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
              {[
                { 
                  title: 'Programming', 
                  icon: 'https://www.svgrepo.com/show/474334/coding.svg', 
                  skills: ['Python', 'C++', 'JavaScript'],
                  color: 'blue'
                },
                { 
                  title: 'Web Development', 
                  icon: 'https://www.svgrepo.com/show/4087/web-development.svg', 
                  skills: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'React Native'],
                  color: 'green'
                },
                { 
                  title: 'Databases', 
                  icon: 'https://www.svgrepo.com/show/499816/database.svg', 
                  skills: ['MongoDB', 'MySQL', 'Firebase'],
                  color: 'purple'
                },
                {
                  title: 'Tools & Tech',
                  icon: 'https://www.svgrepo.com/show/155193/wrench-and-screwdriver.svg',
                  skills: ['Git', 'Docker', 'Figma', 'Linux'],
                  color: 'amber'
                }
              ].map((category) => (
                <motion.div 
                  key={category.title}
                  className="bg-gray-800 rounded-lg p-6 text-center"
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05, 
                    boxShadow: `0px 10px 30px ${
                      category.color === 'blue' ? 'rgba(96, 165, 250, 0.4)' :
                      category.color === 'green' ? 'rgba(52, 211, 153, 0.4)' :
                      category.color === 'purple' ? 'rgba(168, 85, 247, 0.4)' :
                      'rgba(245, 158, 11, 0.4)'
                    }`
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex justify-center items-center mb-4">
                    <img src={category.icon} alt={`${category.title} icon`} className="w-16 h-16" style={{ filter: 'invert(1)' }}/>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    category.color === 'blue' ? 'text-blue-400' :
                    category.color === 'green' ? 'text-green-400' :
                    category.color === 'purple' ? 'text-purple-400' :
                    'text-amber-400'
                  }`}>{category.title}</h3>
                  <div className="inline-block text-left">
                    <div className="space-y-2">
                      {category.skills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 ${
                            category.color === 'blue' ? 'bg-blue-400' :
                            category.color === 'green' ? 'bg-green-400' :
                            category.color === 'purple' ? 'bg-purple-400' :
                            'bg-amber-400'
                          } rounded-full flex-shrink-0`}></div>
                          <p className="text-gray-300">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
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
              <div 
                className="project-card-container border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-blue-400"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop)' }}
              >
                <div className="project-card-content">
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">E-commerce Website</h3>
                  <p className="text-gray-200 mb-4">A sleek and responsive e-commerce site with modern design, built with React and Vite for a fast, seamless user shopping experience.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-800 bg-opacity-80 px-2 py-1 rounded text-xs">React.js</span>
                    <span className="bg-blue-800 bg-opacity-80 px-2 py-1 rounded text-xs">Vite</span>
                    <span className="bg-blue-800 bg-opacity-80 px-2 py-1 rounded text-xs">Tailwind CSS</span>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <a href="https://e-commercccceee.netlify.app/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">🚀 Live Demo</a>
                  </div>
                </div>
              </div>

              {/* Byte Builder Card */}
              <div 
                className="project-card-container border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-green-400"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop)' }}
              >
                <div className="project-card-content">
                  <h3 className="text-2xl font-bold mb-4 text-green-400">Byte Builder</h3>
                  <p className="text-gray-200 mb-4">A real-time coding platform with live code execution, Firebase auth, and community features for collaborative and interactive learning.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-800 bg-opacity-80 px-2 py-1 rounded text-xs">React.js</span>
                    <span className="bg-green-800 bg-opacity-80 px-2 py-1 rounded text-xs">Node.js</span>
                    <span className="bg-green-800 bg-opacity-80 px-2 py-1 rounded text-xs">Firebase</span>
                    <span className="bg-green-800 bg-opacity-80 px-2 py-1 rounded text-xs">Socket.io</span>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <a href="https://code-editor-6rqa.onrender.com/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">🚀 Live Demo</a>
                  </div>
                </div>
              </div>

              {/* Coffee House Card */}
              <div 
                className="project-card-container border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-purple-400"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop)' }}
              >
                <div className="project-card-content">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">Coffee House</h3>
                  <p className="text-gray-200 mb-4">A mobile-first coffee ordering application built with React Native and TypeScript, focusing on a clean UI and intuitive user workflow.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-800 bg-opacity-80 px-2 py-1 rounded text-xs">React Native</span>
                    <span className="bg-purple-800 bg-opacity-80 px-2 py-1 rounded text-xs">TypeScript</span>
                    <span className="bg-purple-800 bg-opacity-80 px-2 py-1 rounded text-xs">CSS</span>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <a href="https://drive.google.com/drive/folders/1JZ0EL0VH1ZSPS8PKMU23dUBty4GjWzK9" target="_blank" rel="noopener noreferrer" className="bg-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors">📁 View Files</a>
                  </div>
                </div>
              </div>
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
                  <div className="text-sm text-gray-400">{achievement.rank}</div>
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

        {/* Contact Section */}
        <section className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Let's Connect</h2>
              <p className="text-lg text-gray-300 mb-8">
                Ready to collaborate on exciting projects or discuss opportunities
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6"
                  whileHover={{ y: -10, scale: 1.05, boxShadow: '0px 10px 30px rgba(96, 165, 250, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="text-2xl mb-3">📧</div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-blue-400">aditya0002adi@gmail.com</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6"
                  whileHover={{ y: -10, scale: 1.05, boxShadow: '0px 10px 30px rgba(52, 211, 153, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="text-2xl mb-3">📱</div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-green-400">+91-7453875563</p>
                </motion.div>
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6"
                  whileHover={{ y: -10, scale: 1.05, boxShadow: '0px 10px 30px rgba(168, 85, 247, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="text-2xl mb-3">📍</div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-purple-400">Bangalore, Karnataka</p>
                </motion.div>
              </div>
              
              <div className="flex justify-center space-x-6">
                <motion.a
                  href="mailto:aditya0002adi@gmail.com"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition-colors"
                  whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(59, 130, 246, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  📧 Send Message
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/adityachaudhary0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-lg transition-colors"
                  whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(29, 78, 216, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  💼 LinkedIn Profile
                </motion.a>
                <motion.a
                  href="https://github.com/AdityaChaudhary0002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition-colors"
                  whileHover={{ y: -2, scale: 1.05, boxShadow: '0px 8px 25px rgba(31, 41, 55, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  💻 GitHub Profile
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;