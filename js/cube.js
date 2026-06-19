// ===== cube.js - المكعب الرئيسي ثلاثي الأبعاد =====
import * as THREE from 'three';

export async function createCube() {
    const group = new THREE.Group();
    const size = 2.5;
    
    // ===== مواد الأوجه مع Canvas Textures =====
    const faceNames = [
        { ar: 'الرئيسية', en: 'HOME', icon: '🏠', color: '#7c3aed' },
        { ar: 'الألعاب', en: 'GAMES', icon: '🎮', color: '#06b6d4' },
        { ar: 'البرامج', en: 'SOFTWARE', icon: '💻', color: '#8b5cf6' },
        { ar: 'الأجهزة', en: 'HARDWARE', icon: '🖥️', color: '#22d3ee' },
        { ar: 'عن الشركة', en: 'ABOUT', icon: '⬡', color: '#a78bfa' },
        { ar: 'اتصل بنا', en: 'CONTACT', icon: '📧', color: '#f0abfc' }
    ];
    
    const faceMaterials = faceNames.map((face, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Background - dark glass
        const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 400);
        gradient.addColorStop(0, 'rgba(20, 20, 50, 0.9)');
        gradient.addColorStop(0.7, 'rgba(10, 10, 30, 0.95)');
        gradient.addColorStop(1, 'rgba(5, 5, 16, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Grid pattern
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 512; i += 32) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }
        
        // Border glow
        const borderGradient = ctx.createLinearGradient(0, 0, 512, 512);
        borderGradient.addColorStop(0, face.color);
        borderGradient.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        borderGradient.addColorStop(1, face.color);
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 3;
        ctx.strokeRect(4, 4, 504, 504);
        
        // Inner border
        ctx.strokeStyle = `rgba(255, 255, 255, 0.06)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 20, 472, 472);
        
        // Icon
        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(face.icon, 256, 200);
        
        // Arabic text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Cairo, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(face.ar, 256, 300);
        
        // English text
        ctx.fillStyle = face.color;
        ctx.font = '28px Orbitron, monospace';
        ctx.fillText(face.en, 256, 360);
        
        // Cube Studios branding
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '18px Orbitron, monospace';
        ctx.fillText('CUBE STUDIOS', 256, 440);
        
        // Corner decorations
        drawCorner(ctx, 30, 30, face.color);
        drawCorner(ctx, 482, 30, face.color);
        drawCorner(ctx, 30, 482, face.color);
        drawCorner(ctx, 482, 482, face.color);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        
        return new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });
    });
    
    // ===== المكعب الرئيسي =====
    const cubeGeometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
    const cube = new THREE.Mesh(cubeGeometry, faceMaterials);
    group.add(cube);
    
    // ===== إطار النيون (الحواف المتوهجة) =====
    const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    group.add(edges);
    
    // ===== إطار خارجي ثانوي (أكبر قليلاً) =====
    const outerFrameGeometry = new THREE.BoxGeometry(size + 0.15, size + 0.15, size + 0.15);
    const outerEdgesGeometry = new THREE.EdgesGeometry(outerFrameGeometry);
    const outerEdgesMaterial = new THREE.LineBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.25,
        linewidth: 1
    });
    const outerEdges = new THREE.LineSegments(outerEdgesGeometry, outerEdgesMaterial);
    group.add(outerEdges);
    
    // ===== جسيمات زوايا المكعب =====
    const corners = [
        [-size/2, -size/2, -size/2], [size/2, -size/2, -size/2],
        [-size/2, size/2, -size/2],  [size/2, size/2, -size/2],
        [-size/2, -size/2, size/2],  [size/2, -size/2, size/2],
        [-size/2, size/2, size/2],   [size/2, size/2, size/2]
    ];
    
    const cornerGlowGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const cornerGlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xc4b5fd,
        transparent: true,
        opacity: 0.9
    });
    
    corners.forEach(([x, y, z]) => {
        const glow = new THREE.Mesh(cornerGlowGeometry, cornerGlowMaterial);
        glow.position.set(x, y, z);
        group.add(glow);
    });
    
    // ===== شعار Cube Studios عائم أمام المكعب =====
    const logoGroup = new THREE.Group();
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 256;
    logoCanvas.height = 128;
    const logoCtx = logoCanvas.getContext('2d');
    
    logoCtx.fillStyle = '#ffffff';
    logoCtx.font = 'bold 36px Orbitron, monospace';
    logoCtx.textAlign = 'center';
    logoCtx.fillText('CUBE', 128, 45);
    
    logoCtx.fillStyle = '#a78bfa';
    logoCtx.fillText('STUDIOS', 128, 90);
    
    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.minFilter = THREE.LinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;
    
    const logoMaterial = new THREE.SpriteMaterial({
        map: logoTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.NormalBlending,
        depthTest: false,
        depthWrite: false
    });
    
    const logoSprite = new THREE.Sprite(logoMaterial);
    logoSprite.position.set(0, size/2 + 0.8, 0);
    logoSprite.scale.set(2.5, 1.25, 1);
    group.add(logoSprite);
    
    // ===== دوائر طاقة حول المكعب =====
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(size/2 + 0.3 + i * 0.15, 0.015, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: i === 0 ? 0x7c3aed : i === 1 ? 0x06b6d4 : 0xa78bfa,
            transparent: true,
            opacity: 0.4 - i * 0.1,
            depthTest: false,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.userData = {
            rotationSpeed: 0.2 + i * 0.1,
            axis: i === 0 ? 'x' : i === 1 ? 'y' : 'z',
            baseOpacity: 0.4 - i * 0.1
        };
        group.add(ring);
    }
    
    // ===== إعدادات إضافية =====
    group.userData = {
        logo: logoSprite,
        edges: edges,
        outerEdges: outerEdges,
        rings: group.children.filter(c => c.geometry && c.geometry.type === 'TorusGeometry'),
        cornerGlows: group.children.filter(c => c.geometry && c.geometry.type === 'SphereGeometry'),
        targetRotation: new THREE.Euler(0, 0, 0),
        currentFace: 0
    };
    
    return group;
}

// ===== دالة مساعدة لرسم زوايا مزخرفة =====
function drawCorner(ctx, x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 30, y);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 30);
    ctx.stroke();
    
    // Small dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
}