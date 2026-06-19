// ===== interaction.js - نظام التفاعل الكامل =====
import * as THREE from 'three';
import { createBurst } from './particles.js';

export function setupInteraction(cubeGroup, camera, renderer, container, onFaceSelect) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const touchPoint = new THREE.Vector2();
    
    let isDragging = false;
    let isTouching = false;
    let previousMouse = { x: 0, y: 0 };
    let previousTouch = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    let autoRotate = true;
    let autoRotateSpeed = 0.3;
    let hoveredFace = null;
    let doubleClickTimer = null;
    
    // ===== مؤشر الماوس المخصص (Custom Cursor Glow) =====
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 50;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);
    
    // ===== Mouse Events =====
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('dblclick', onDoubleClick);
    container.addEventListener('wheel', onWheel);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseenter', onMouseEnter);
    
    // ===== Touch Events =====
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    
    // ===== Keyboard =====
    document.addEventListener('keydown', onKeyDown);
    
    function onMouseMove(event) {
        mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
        
        // تحريك المؤشر المتوهج
        cursorGlow.style.left = event.clientX + 'px';
        cursorGlow.style.top = event.clientY + 'px';
        cursorGlow.style.opacity = '1';
        
        if (isDragging) {
            const deltaX = event.clientX - previousMouse.x;
            const deltaY = event.clientY - previousMouse.y;
            
            cubeGroup.rotation.y += deltaX * 0.005;
            cubeGroup.rotation.x += deltaY * 0.005;
            
            rotationVelocity.y = deltaX * 0.005;
            rotationVelocity.x = deltaY * 0.005;
            
            previousMouse.x = event.clientX;
            previousMouse.y = event.clientY;
            autoRotate = false;
        }
        
        // التحقق من التحويم على وجه
        checkFaceHover();
    }
    
    function onMouseDown(event) {
        isDragging = true;
        previousMouse.x = event.clientX;
        previousMouse.y = event.clientY;
        autoRotate = false;
        container.style.cursor = 'grabbing';
    }
    
    function onMouseUp() {
        isDragging = false;
        container.style.cursor = 'grab';
        
        // استئناف الدوران التلقائي بعد فترة
        clearTimeout(doubleClickTimer);
        doubleClickTimer = setTimeout(() => {
            autoRotate = true;
        }, 2000);
    }
    
    function onClick(event) {
        // تجاهل إذا كان سحب
        const dx = Math.abs(event.clientX - previousMouse.x);
        const dy = Math.abs(event.clientY - previousMouse.y);
        
        if (dx < 3 && dy < 3) {
            // نقرة حقيقية وليست سحب
            checkFaceClick();
        }
    }
    
    function onDoubleClick(event) {
        // إعادة ضبط الدوران
        autoRotate = true;
        rotationVelocity.x = 0;
        rotationVelocity.y = 0;
    }
    
    function onWheel(event) {
        event.preventDefault();
        camera.position.z += event.deltaY * 0.01;
        camera.position.z = Math.max(4, Math.min(15, camera.position.z));
    }
    
    function onMouseLeave() {
        cursorGlow.style.opacity = '0';
        container.style.cursor = 'default';
    }
    
    function onMouseEnter() {
        cursorGlow.style.opacity = '1';
        container.style.cursor = 'grab';
    }
    
    // ===== Touch Handlers =====
    function onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            isTouching = true;
            autoRotate = false;
            previousTouch.x = event.touches[0].clientX;
            previousTouch.y = event.touches[0].clientY;
        }
    }
    
    function onTouchMove(event) {
        if (isTouching && event.touches.length === 1) {
            event.preventDefault();
            const deltaX = event.touches[0].clientX - previousTouch.x;
            const deltaY = event.touches[0].clientY - previousTouch.y;
            
            cubeGroup.rotation.y += deltaX * 0.005;
            cubeGroup.rotation.x += deltaY * 0.005;
            
            previousTouch.x = event.touches[0].clientX;
            previousTouch.y = event.touches[0].clientY;
        }
    }
    
    function onTouchEnd() {
        isTouching = false;
        setTimeout(() => { autoRotate = true; }, 2000);
    }
    
    // ===== Keyboard Handler =====
    function onKeyDown(event) {
        const speed = 0.5;
        switch(event.key.toLowerCase()) {
            case 'arrowleft':
                cubeGroup.rotation.y -= speed;
                autoRotate = false;
                break;
            case 'arrowright':
                cubeGroup.rotation.y += speed;
                autoRotate = false;
                break;
            case 'arrowup':
                cubeGroup.rotation.x -= speed;
                autoRotate = false;
                break;
            case 'arrowdown':
                cubeGroup.rotation.x += speed;
                autoRotate = false;
                break;
            case 'r':
                // إعادة ضبط
                autoRotate = true;
                cubeGroup.rotation.set(0, 0, 0);
                break;
        }
    }
    
    // ===== Face Detection =====
    function getIntersectingFace() {
        raycaster.setFromCamera(mouse, camera);
        
        // البحث عن المكعب الرئيسي فقط
        const mainCube = cubeGroup.children.find(c => 
            c.isMesh && c.geometry.type === 'BoxGeometry'
        );
        
        if (!mainCube) return null;
        
        const intersects = raycaster.intersectObject(mainCube);
        
        if (intersects.length > 0) {
            const faceIndex = Math.floor(intersects[0].faceIndex / 2);
            return faceIndex;
        }
        
        return null;
    }
    
    function checkFaceHover() {
        const faceIndex = getIntersectingFace();
        
        if (faceIndex !== hoveredFace) {
            // إعادة تعيين الوجه السابق
            if (hoveredFace !== null) {
                resetFaceGlow(hoveredFace);
            }
            
            hoveredFace = faceIndex;
            
            // توهج الوجه الجديد
            if (hoveredFace !== null) {
                highlightFace(hoveredFace);
                container.style.cursor = 'pointer';
            } else {
                container.style.cursor = 'grab';
            }
        }
    }
    
    function checkFaceClick() {
        const faceIndex = getIntersectingFace();
        
        if (faceIndex !== null) {
            // إنشاء انفجار جسيمات
            const intersectPoint = new THREE.Vector3();
            raycaster.ray.at(3, intersectPoint);
            createBurst(cubeGroup.parent.children.find(c => 
                c.userData && c.userData.update
            ), intersectPoint);
            
            // استدعاء دالة اختيار الوجه
            if (onFaceSelect) {
                onFaceSelect(faceIndex);
            }
        }
    }
    
    function highlightFace(faceIndex) {
        const mainCube = cubeGroup.children.find(c => 
            c.isMesh && c.geometry.type === 'BoxGeometry'
        );
        if (mainCube && mainCube.material[faceIndex]) {
            mainCube.material[faceIndex].emissive = new THREE.Color(0x333366);
            mainCube.material[faceIndex].emissiveIntensity = 0.5;
        }
    }
    
    function resetFaceGlow(faceIndex) {
        const mainCube = cubeGroup.children.find(c => 
            c.isMesh && c.geometry.type === 'BoxGeometry'
        );
        if (mainCube && mainCube.material[faceIndex]) {
            mainCube.material[faceIndex].emissive = new THREE.Color(0x000000);
            mainCube.material[faceIndex].emissiveIntensity = 0;
        }
    }
    
    // ===== Animation Loop Update =====
    function update(deltaTime) {
        // الدوران التلقائي
        if (autoRotate) {
            cubeGroup.rotation.y += autoRotateSpeed * deltaTime;
        } else if (!isDragging && !isTouching) {
            // تخفيف السرعة تدريجياً
            cubeGroup.rotation.y += rotationVelocity.y;
            cubeGroup.rotation.x += rotationVelocity.x;
            
            rotationVelocity.y *= 0.95;
            rotationVelocity.x *= 0.95;
        }
        
        // تحديث حلقات الطاقة
        const rings = cubeGroup.userData.rings;
        if (rings) {
            rings.forEach(ring => {
                ring.rotation.z += 0.01;
            });
        }
        
        // نبض توهج الزوايا
        const cornerGlows = cubeGroup.userData.cornerGlows;
        if (cornerGlows) {
            const pulse = Math.sin(performance.now() * 0.003) * 0.3 + 0.7;
            cornerGlows.forEach(glow => {
                glow.material.opacity = pulse;
            });
        }
    }
    
    // إرجاع دالة التحديث لاستخدامها في حلقة التحريك الرئيسية
    return {
        update,
        isAutoRotating: () => autoRotate,
        setAutoRotate: (val) => { autoRotate = val; }
    };
}