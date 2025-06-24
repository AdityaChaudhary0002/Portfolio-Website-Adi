import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, Box, Float, Environment, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
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
        <>
          {projects.map((project, index) => (
            <ProjectCard3D
              key={project.title}
              position={project.position}
              project={project}
              index={index}
            />
          ))}
        </>
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
              <div className="bg-blue-600 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">📍 Bangalore, Karnataka</span>
              </div>
              <div className="bg-green-600 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">🎓 B.Tech CSE</span>
              </div>
              <div className="bg-purple-600 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">💼 Open to Work</span>
              </div>
            </div>
            <div className="flex justify-center space-x-6">
              <a href="mailto:aditya0002adi@gmail.com" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
                📧 Contact Me
              </a>
              <a href="https://www.linkedin.com/in/adityachaudhary0/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg transition-colors">
                💼 LinkedIn
              </a>
              <a href="https://github.com/AdityaChaudhary0002" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors">
                💻 GitHub
              </a>
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
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-400 mb-2">Education</h3>
                    <p className="text-sm text-gray-300">B.Tech CSE - 7.24/10 CGPA</p>
                    <p className="text-xs text-gray-400">LPU, Jalandhar</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-400 mb-2">Experience</h3>
                    <p className="text-sm text-gray-300">Multiple Projects</p>
                    <p className="text-xs text-gray-400">Full Stack Development</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1 mx-auto">
                    <img 
                      src="data:image/jpeg;base64,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"
                      alt="Aditya Chaudhary"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 w-full">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Projects Completed</span>
                      <span className="text-blue-400 font-bold">3+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Problems Solved</span>
                      <span className="text-green-400 font-bold">1500+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max LeetCode Rating</span>
                      <span className="text-purple-400 font-bold">1805</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certifications</span>
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Technical Skills</h2>
              <p className="text-lg text-gray-300">Hover over the 3D skill orbs above to explore my expertise</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Programming</h3>
                <div className="space-y-2">
                  {['Python', 'C++', 'JavaScript'].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-green-400">Web Development</h3>
                <div className="space-y-2">
                  {['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'React Native'].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Database & Tools</h3>
                <div className="space-y-2">
                  {['MongoDB', 'MySQL', 'Firebase', 'Git', 'Docker'].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              <p className="text-lg text-gray-300">Explore my 3D project showcase above</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3" 
                    alt="Coffee House App"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">Coffee House</h3>
                  <p className="text-gray-300 mb-4">
                    Virtual Coffee Shop App developed with React Native and TypeScript, featuring product browsing, 
                    favorites, and dynamic shopping cart.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['React Native', 'TypeScript', 'CSS'].map((tech) => (
                      <span key={tech} className="bg-blue-600 px-2 py-1 rounded text-xs">{tech}</span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <a 
                      href="https://drive.google.com/drive/folders/1JZ0EL0VH1ZSPS8PKMU23dUBty4GjWzK9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      📁 View Files
                    </a>
                  </div>
                  <div className="text-sm text-gray-400">Apr 2025</div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg" 
                    alt="Byte Builder Platform"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-green-400">Byte Builder</h3>
                  <p className="text-gray-300 mb-4">
                    Real-time coding platform with live code execution, Firebase authentication, and community features 
                    for collaborative learning.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['React.js', 'Node.js', 'Firebase', 'Socket.io'].map((tech) => (
                      <span key={tech} className="bg-green-600 px-2 py-1 rounded text-xs">{tech}</span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <a 
                      href="https://code-editor-6rqa.onrender.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      🚀 Live Demo
                    </a>
                  </div>
                  <div className="text-sm text-gray-400">Jan 2025</div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg" 
                    alt="Ecommerce Website"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">Ecommerce Website</h3>
                  <p className="text-gray-300 mb-4">
                    Modern responsive ecommerce site with shopping cart, product filters, wishlist, and order tracking functionality.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['React.js', 'Vite', 'Tailwind CSS'].map((tech) => (
                      <span key={tech} className="bg-purple-600 px-2 py-1 rounded text-xs">{tech}</span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <a 
                      href="https://e-commercccceee.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      🚀 Live Demo
                    </a>
                  </div>
                  <div className="text-sm text-gray-400">Dec 2024</div>
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
                { platform: 'LeetCode', rating: '1805', rank: 'Top 7%', color: 'orange', icon: '🟡', url: 'https://leetcode.com/' },
                { platform: 'CodeChef', rating: '1650', rank: '3-Star', color: 'amber', icon: '🍽️', url: 'https://www.codechef.com/' },
                { platform: 'Codeforces', rating: '1278', rank: 'Pupil', color: 'blue', icon: '🔵', url: 'https://codeforces.com/' },
                { platform: 'GeeksforGeeks', rating: '1363', rank: 'Active', color: 'green', icon: '🟢', url: 'https://www.geeksforgeeks.org/' },
              ].map((achievement) => (
                <motion.div
                  key={achievement.platform}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => window.open(achievement.url, '_blank')}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
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
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-2xl mb-3">📧</div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-blue-400">aditya0002adi@gmail.com</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-2xl mb-3">📱</div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-green-400">+91-7453875563</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-2xl mb-3">📍</div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-purple-400">Bangalore, Karnataka</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-6">
                <a href="mailto:aditya0002adi@gmail.com" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition-colors">
                  Send Message
                </a>
                <a href="https://www.linkedin.com/in/adityachaudhary0/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-lg transition-colors">
                  LinkedIn Profile
                </a>
                <a href="https://github.com/AdityaChaudhary0002" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition-colors">
                  GitHub Profile
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;