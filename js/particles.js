// ===== particles.js - جميع أنظمة الجسيمات =====
import * as THREE from 'three';

export function createParticleSystems() {
    const group = new THREE.Group();
    
    // ===== 1. جسيمات مدارية حول المكعب (Orbital) =====
    const orbitalCount = 3000;
    const orbitalGeometry = new THREE.BufferGeometry();
    const orbitalPositions = new Float32Array(orbitalCount * 3);
    const orbitalColors = new Float32Array(orbitalCount * 3);
    const orbitalSizes = new Float32Array(orbitalCount);
    const orbitalData = []; // لتخزين بيانات المدار
    
    for (let i = 0; i < orbitalCount; i++) {
        // توزيع الجسيمات في مدارات إهليلجية
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.8 + Math.random() * 2.5;
        const height = (Math.random() - 0.5) * 4;
        
        orbitalPositions[i * 3] = Math.cos(angle) * radius;
        orbitalPositions[i * 3 + 1] = height;
        orbitalPositions[i * 3 + 2] = Math.sin(angle) * radius;
        
        // ألوان: بنفسجي ↔ أزرق سماوي
        const mix = Math.random();
        orbitalColors[i * 3] = 0.3 + mix * 0.2;      // R
        orbitalColors[i * 3 + 1] = 0.1 + mix * 0.5;   // G
        orbitalColors[i * 3 + 2] = 0.6 + mix * 0.4;   // B
        
        orbitalSizes[i] = Math.random() * 0.04 + 0.01;
        
        orbitalData.push({
            angle,
            radius,
            height,
            speed: 0.1 + Math.random() * 0.4,
            verticalSpeed: (Math.random() - 0.5) * 0.3
        });
    }
    
    orbitalGeometry.setAttribute('position', new THREE.BufferAttribute(orbitalPositions, 3));
    orbitalGeometry.setAttribute('color', new THREE.BufferAttribute(orbitalColors, 3));
    orbitalGeometry.setAttribute('size', new THREE.BufferAttribute(orbitalSizes, 1));
    
    // استخدام ShaderMaterial مخصص للتوهج
    const orbitalMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        transparent: true,
        opacity: 0.7
    });
    
    const orbitalParticles = new THREE.Points(orbitalGeometry, orbitalMaterial);
    orbitalParticles.userData = {
        particles: orbitalData,
        positions: orbitalPositions,
        type: 'orbital'
    };
    group.add(orbitalParticles);
    
    // ===== 2. جسيمات النواة (داخل المكعب) =====
    const coreCount = 500;
    const coreGeometry = new THREE.BufferGeometry();
    const corePositions = new Float32Array(coreCount * 3);
    const coreColors = new Float32Array(coreCount * 3);
    const coreData = [];
    
    for (let i = 0; i < coreCount; i++) {
        // كروي داخل المكعب
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * 1.0;
        
        corePositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
        corePositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
        corePositions[i * 3 + 2] = Math.cos(phi) * r;
        
        coreColors[i * 3] = 0.8;      // R - أبيض مائل للبنفسجي
        coreColors[i * 3 + 1] = 0.7;
        coreColors[i * 3 + 2] = 1.0;
        
        coreData.push({
            baseX: corePositions[i * 3],
            baseY: corePositions[i * 3 + 1],
            baseZ: corePositions[i * 3 + 2],
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.7,
            amplitude: 0.05 + Math.random() * 0.15
        });
    }
    
    coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));
    
    const coreMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        transparent: true,
        opacity: 0.9
    });
    
    const coreParticles = new THREE.Points(coreGeometry, coreMaterial);
    coreParticles.userData = {
        particles: coreData,
        positions: corePositions,
        type: 'core'
    };
    group.add(coreParticles);
    
    // ===== 3. خطوط الطاقة (Connecting Lines) =====
    const linesCount = 50;
    const linesGeometry = new THREE.BufferGeometry();
    const linesPositions = new Float32Array(linesCount * 6); // نقطتين لكل خط
    const linesData = [];
    
    for (let i = 0; i < linesCount; i++) {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = angle1 + (Math.random() - 0.5) * 1.5;
        const radius = 1.5 + Math.random() * 2;
        
        linesPositions[i * 6] = Math.cos(angle1) * radius;
        linesPositions[i * 6 + 1] = (Math.random() - 0.5) * 3;
        linesPositions[i * 6 + 2] = Math.sin(angle1) * radius;
        linesPositions[i * 6 + 3] = Math.cos(angle2) * radius;
        linesPositions[i * 6 + 4] = (Math.random() - 0.5) * 3;
        linesPositions[i * 6 + 5] = Math.sin(angle2) * radius;
        
        linesData.push({
            speed: 0.2 + Math.random() * 0.8,
            phase: Math.random() * Math.PI * 2
        });
    }
    
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
    
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false
    });
    
    const energyLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    energyLines.userData = {
        lines: linesData,
        positions: linesPositions,
        type: 'lines'
    };
    group.add(energyLines);
    
    // ===== 4. جسيمات الاندفاع (تنشأ عند النقر) =====
    const burstGroup = new THREE.Group();
    burstGroup.visible = false;
    burstGroup.userData = {
        type: 'burst',
        active: false,
        particles: [],
        startTime: 0
    };
    group.add(burstGroup);
    
    // ===== دالة التحديث العامة =====
    group.userData.update = function(time) {
        const t = time * 0.001; // الثواني
        
        // تحديث الجسيمات المدارية
        if (orbitalParticles.userData.type === 'orbital') {
            const data = orbitalParticles.userData.particles;
            const pos = orbitalParticles.userData.positions;
            
            for (let i = 0; i < data.length; i++) {
                data[i].angle += data[i].speed * 0.005;
                data[i].height += Math.sin(t + data[i].verticalSpeed) * 0.002;
                
                // إبقاء الارتفاع في النطاق
                if (Math.abs(data[i].height) > 2.5) {
                    data[i].verticalSpeed *= -1;
                }
                
                pos[i * 3] = Math.cos(data[i].angle) * data[i].radius;
                pos[i * 3 + 1] = data[i].height;
                pos[i * 3 + 2] = Math.sin(data[i].angle) * data[i].radius;
            }
            orbitalParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // تحديث جسيمات النواة
        if (coreParticles.userData.type === 'core') {
            const data = coreParticles.userData.particles;
            const pos = coreParticles.userData.positions;
            
            for (let i = 0; i < data.length; i++) {
                const wobble = Math.sin(t * data[i].speed + data[i].phase) * data[i].amplitude;
                pos[i * 3] = data[i].baseX + wobble;
                pos[i * 3 + 1] = data[i].baseY + wobble * 1.3;
                pos[i * 3 + 2] = data[i].baseZ + wobble * 0.7;
            }
            coreParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // تحديث خطوط الطاقة
        if (energyLines.userData.type === 'lines') {
            const lines = energyLines.userData.lines;
            const pos = energyLines.userData.positions;
            
            for (let i = 0; i < lines.length; i++) {
                const pulse = Math.sin(t * lines[i].speed + lines[i].phase) * 0.3;
                // اختصار: نغير الشفافية فقط للتبسيط
            }
            energyLines.material.opacity = 0.1 + Math.sin(t * 0.7) * 0.05;
        }
        
        // تحديث جسيمات الاندفاع
        if (burstGroup.userData.active) {
            const elapsed = t - burstGroup.userData.startTime;
            if (elapsed > 2) {
                // إخفاء بعد ثانيتين
                burstGroup.visible = false;
                burstGroup.userData.active = false;
                burstGroup.clear();
            } else {
                // تحريك الجسيمات للخارج
                burstGroup.children.forEach(particle => {
                    particle.position.x += particle.userData.vx * 0.03;
                    particle.position.y += particle.userData.vy * 0.03;
                    particle.position.z += particle.userData.vz * 0.03;
                    particle.material.opacity = Math.max(0, particle.material.opacity - 0.01);
                });
            }
        }
    };
    
    return group;
}

// ===== دالة إنشاء انفجار جسيمات =====
export function createBurst(group, position, color = 0xa78bfa) {
    const burstGroup = group.children.find(c => c.userData && c.userData.type === 'burst');
    if (!burstGroup) return;
    
    burstGroup.clear();
    burstGroup.visible = true;
    burstGroup.userData.active = true;
    burstGroup.userData.startTime = performance.now() * 0.001;
    
    const particleCount = 100;
    const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
    
    for (let i = 0; i < particleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particle = new THREE.Mesh(particleGeometry, material);
        particle.position.copy(position);
        particle.userData = {
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            vz: (Math.random() - 0.5) * 3
        };
        
        burstGroup.add(particle);
    }
}