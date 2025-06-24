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
                  <img 
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    alt="Aditya Chaudhary Profile"
                    className="w-48 h-48 rounded-full object-cover border-4 border-blue-400 shadow-lg hover:shadow-blue-400/30 transition-shadow duration-300"
                  />
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
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
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
                <div className="text-sm text-gray-400">Apr 2025</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
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
                <div className="text-sm text-gray-400">Jan 2025</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Ecommerce Website</h3>
                <p className="text-gray-300 mb-4">
                  Modern responsive ecommerce site with shopping cart, product filters, wishlist, and order tracking functionality.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['React.js', 'Vite', 'Tailwind CSS'].map((tech) => (
                    <span key={tech} className="bg-purple-600 px-2 py-1 rounded text-xs">{tech}</span>
                  ))}
                </div>
                <div className="text-sm text-gray-400">Dec 2024</div>
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
                { platform: 'LeetCode', rating: '1805', rank: 'Top 7%', color: 'yellow' },
                { platform: 'CodeChef', rating: '1650', rank: '3-Star', color: 'green' },
                { platform: 'Codeforces', rating: '1278', rank: 'Pupil', color: 'blue' },
                { platform: 'GeeksforGeeks', rating: '1363', rank: 'Active', color: 'purple' },
              ].map((achievement) => (
                <motion.div
                  key={achievement.platform}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className={`bg-gray-800 rounded-lg p-6 text-center hover:bg-${achievement.color}-900 transition-colors`}
                >
                  <div className={`text-4xl font-bold mb-2 text-${achievement.color}-400`}>
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
                <a href="#" className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition-colors">
                  Download Resume
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