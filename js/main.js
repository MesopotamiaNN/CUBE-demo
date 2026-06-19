// ===== Imports =====
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { createCube } from './cube.js';
import { createParticleSystems } from './particles.js';
import { setupInteraction } from './interaction.js';
import { getFaceContent } from './content.js';

// ===== DOM Elements =====
const canvas = document.getElementById('three-canvas');
const container = document.getElementById('canvas-container');
const loadingScreen = document.getElementById('loading-screen');
const infoPanel = document.getElementById('info-panel');
const panelContent = document.getElementById('panel-content');
const closePanelBtn = document.getElementById('close-panel');
const mobileBtns = document.querySelectorAll('.mobile-btn');
const navLinks = document.querySelectorAll('.nav-links a');

// ===== Scene Setup =====
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45, // FOV - wider for mobile
    container.clientWidth / container.clientHeight,
    0.1,
    100
);
camera.position.set(0, 1.5, 8);
camera.lookAt(0, 0, 0);

// Renderer with pixel ratio optimization
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ===== Post Processing =====
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom (glow effect)
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.5,  // strength
    0.4,  // radius
    0.85  // threshold
);
composer.addPass(bloomPass);

// RGB Shift (chromatic aberration - subtle)
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0015;
composer.addPass(rgbShiftPass);
rgbShiftPass.renderToScreen = true;

// ===== Lighting =====
const ambientLight = new THREE.AmbientLight(0x1a1a3e, 1.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x7c3aed, 30, 15);
pointLight1.position.set(3, 2, 3);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x06b6d4, 20, 12);
pointLight2.position.set(-3, -1, -2);
scene.add(pointLight2);

// ===== Background Stars =====
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const starsPositions = new Float32Array(starsCount * 3);
const starsSizes = new Float32Array(starsCount);

for (let i = 0; i < starsCount * 3; i += 3) {
    starsPositions[i] = (Math.random() - 0.5) * 30;
    starsPositions[i + 1] = (Math.random() - 0.5) * 20;
    starsPositions[i + 2] = (Math.random() - 0.5) * 15 - 5;
    starsSizes[i / 3] = Math.random() * 2;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// ===== Main Cube =====
let mainCube;
let particleSystems;
let currentFace = 0;

// ===== Create Scene Objects =====
async function initScene() {
    mainCube = await createCube();
    scene.add(mainCube);
    
    particleSystems = createParticleSystems();
    scene.add(particleSystems);
    
    // Setup interaction
    setupInteraction(mainCube, camera, renderer, container, onFaceSelect);
    
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 800);
    }, 1500);
}

// ===== Face Selection Handler =====
function onFaceSelect(faceIndex) {
    currentFace = faceIndex;
    
    // Update navigation
    updateNavigation(faceIndex);
    
    // Show info panel
    const content = getFaceContent(faceIndex);
    panelContent.innerHTML = content;
    infoPanel.classList.add('visible');
    
    // Animate cube rotation
    animateCubeToFace(faceIndex);
}

// ===== Animate Cube =====
function animateCubeToFace(faceIndex) {
    const targetRotation = getFaceRotation(faceIndex);
    
    // Smooth spring animation using GSAP if available, else manual
    const startRotation = {
        x: mainCube.rotation.x,
        y: mainCube.rotation.y,
        z: mainCube.rotation.z
    };
    
    const duration = 1200; // ms
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out elastic
        const t = easeOutElastic(progress);
        
        mainCube.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * t;
        mainCube.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * t;
        mainCube.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * t;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function getFaceRotation(faceIndex) {
    const rotations = [
        { x: 0, y: 0, z: 0 },                    // Front - Home
        { x: 0, y: Math.PI / 2, z: 0 },          // Right - Games
        { x: 0, y: Math.PI, z: 0 },              // Back - Software
        { x: 0, y: -Math.PI / 2, z: 0 },         // Left - Hardware
        { x: -Math.PI / 2, y: 0, z: 0 },         // Top - About
        { x: Math.PI / 2, y: 0, z: 0 }           // Bottom - Contact
    ];
    return rotations[faceIndex];
}

function easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

// ===== Navigation Updates =====
function updateNavigation(faceIndex) {
    // Mobile buttons
    mobileBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === faceIndex);
    });
    
    // Desktop nav links
    navLinks.forEach((link, i) => {
        link.classList.toggle('nav-active', i === faceIndex);
    });
}

// ===== Event Listeners =====
// Mobile buttons
mobileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const faceIndex = parseInt(btn.dataset.face);
        onFaceSelect(faceIndex);
    });
});

// Desktop navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const faceIndex = parseInt(link.dataset.face);
        onFaceSelect(faceIndex);
    });
});

// Close panel
closePanelBtn.addEventListener('click', () => {
    infoPanel.classList.remove('visible');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const keys = ['1', '2', '3', '4', '5', '6'];
    const index = keys.indexOf(e.key);
    if (index !== -1) {
        onFaceSelect(index);
    }
    if (e.key === 'Escape') {
        infoPanel.classList.remove('visible');
    }
});

// ===== Resize Handler =====
function onResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    composer.setSize(width, height);
    
    // Adjust camera distance for mobile
    if (width < 768) {
        camera.position.z = 10;
    } else {
        camera.position.z = 8;
    }
    camera.lookAt(0, 0, 0);
    
    // Update bloom resolution
    bloomPass.resolution.set(width, height);
}

window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', () => {
    setTimeout(onResize, 100);
});

// ===== Performance Monitor =====
let frameCount = 0;
let lastTime = performance.now();
const fpsElement = document.getElementById('fps-counter');

function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        if (fpsElement) fpsElement.textContent = `${fps} FPS`;
        frameCount = 0;
        lastTime = currentTime;
    }
}

// ===== Animation Loop =====
function animate(time) {
    requestAnimationFrame(animate);
    
    updateFPS();
    
    // Rotate stars slowly
    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.00005;
    
    // Animate particles
    if (particleSystems && particleSystems.userData.update) {
        particleSystems.userData.update(time);
    }
    
    // Pulse lights
    const pulse = Math.sin(time * 0.001) * 0.2 + 0.8;
    pointLight1.intensity = 30 * pulse;
    pointLight2.intensity = 20 * (1.2 - pulse);
    
    // Render with post-processing
    composer.render();
}

// ===== Initialize =====
initScene().then(() => {
    requestAnimationFrame(animate);
});