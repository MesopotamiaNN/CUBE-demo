// ===== content.js - محتوى الصفحات لكل وجه =====

export function getFaceContent(faceIndex) {
    const contents = [
        getHomeContent(),
        getGamesContent(),
        getSoftwareContent(),
        getHardwareContent(),
        getAboutContent(),
        getContactContent()
    ];
    
    return contents[faceIndex] || '';
}

function getHomeContent() {
    return `
        <div class="panel-inner">
            <div class="panel-icon">🏠</div>
            <h2 class="panel-title">Cube Studios</h2>
            <p class="panel-subtitle">نصنع المستقبل الرقمي</p>
            <p class="panel-description">
                نحن استوديو إبداعي متكامل يجمع بين تطوير الألعاب الغامرة، 
                والبرمجيات المتطورة، والأجهزة المبتكرة. نؤمن بأن التقنية 
                يجب أن تكون تجربة فريدة تلامس الحواس.
            </p>
            <div class="panel-stats">
                <div class="stat">
                    <span class="stat-number">+50</span>
                    <span class="stat-label">مشروع مكتمل</span>
                </div>
                <div class="stat">
                    <span class="stat-number">+30</span>
                    <span class="stat-label">عميل سعيد</span>
                </div>
                <div class="stat">
                    <span class="stat-number">7</span>
                    <span class="stat-label">سنوات خبرة</span>
                </div>
            </div>
            <a href="#" class="panel-btn" data-action="games">🎮 استكشف ألعابنا</a>
        </div>
    `;
}

function getGamesContent() {
    return `
        <div class="panel-inner">
            <div class="panel-icon">🎮</div>
            <h2 class="panel-title">الألعاب</h2>
            <p class="panel-subtitle">عوالم غامرة تنتظرك</p>
            <div class="games-list">
                <div class="game-card">
                    <div class="game-icon">🚀</div>
                    <h3>Star Voyagers</h3>
                    <p>لعبة استكشاف فضائي بتقنية الواقع الافتراضي</p>
                    <span class="game-tag">VR</span>
                </div>
                <div class="game-card">
                    <div class="game-icon">⚔️</div>
                    <h3>Shadow Realms</h3>
                    <p>لعبة تقمص أدوار في عالم مظلم ساحر</p>
                    <span class="game-tag">RPG</span>
                </div>
                <div class="game-card">
                    <div class="game-icon">🏎️</div>
                    <h3>Neon Drift</h3>
                    <p>سباقات مستقبلية بإضاءات نيون مبهرة</p>
                    <span class="game-tag">Racing</span>
                </div>
            </div>
            <a href="#" class="panel-btn">🎮 شاهد كل الألعاب</a>
        </div>
    `;
}

function getSoftwareContent() {
    return `
        <div class="panel-inner">
            <div class="panel-icon">💻</div>
            <h2 class="panel-title">البرامج</h2>
            <p class="panel-subtitle">حلول برمجية ذكية</p>
            <div class="software-list">
                <div class="soft-item">
                    <span class="soft-icon">🤖</span>
                    <div>
                        <h3>Cube AI Engine</h3>
                        <p>محرك ذكاء اصطناعي خاص للألعاب والتطبيقات</p>
                    </div>
                </div>
                <div class="soft-item">
                    <span class="soft-icon">📊</span>
                    <div>
                        <h3>DataViz Pro</h3>
                        <p>منصة تحليل بيانات بتصورات ثلاثية الأبعاد</p>
                    </div>
                </div>
                <div class="soft-item">
                    <span class="soft-icon">🔒</span>
                    <div>
                        <h3>SecureCube</h3>
                        <p>نظام تشفير متقدم لحماية البيانات</p>
                    </div>
                </div>
            </div>
            <a href="#" class="panel-btn">💻 جميع البرامج</a>
        </div>
    `;
}

function getHardwareContent() {
    return `
        <div class="panel-inner">
            <div class="panel-icon">🖥️</div>
            <h2 class="panel-title">الأجهزة</h2>
            <p class="panel-subtitle">عتاد صُمم للمستقبل</p>
            <div class="hardware-grid">
                <div class="hw-card">
                    <div class="hw-icon">🎧</div>
                    <h3>Cube Sonic</h3>
                    <p>سماعة ألعاب بصوت محيطي</p>
                </div>
                <div class="hw-card">
                    <div class="hw-icon">⌨️</div>
                    <h3>Cube Mech</h3>
                    <p>لوحة مفاتيح ميكانيكية مخصصة</p>
                </div>
                <div class="hw-card">
                    <div class="hw-icon">🖱️</div>
                    <h3>Cube Pulse</h3>
                    <p>فأرة ألعاب بدقة 16K</p>
                </div>
                <div class="hw-card">
                    <div class="hw-icon">💡</div>
                    <h3>Cube Light</h3>
                    <p>نظام إضاءة RGB ذكي</p>
                </div>
            </div>
            <a href="#" class="panel-btn">🖥️ متجر الأجهزة</a>
        </div>
    `;
}

function getAboutContent() {
    return `
        <div class="panel-inner">
            <div class="panel-icon">⬡</div>
            <h2 class="panel-title">عن Cube Studios</h2>
            <p class="panel-subtitle">قصتنا بدأت من مكعب صغير</p>
            <p class="panel-description">
                تأسست Cube Studios عام 2018 على يد مجموعة من المبدعين 
                والمهندسين الطموحين. بدأنا كفريق صغير يعمل من غرفة واحدة، 
                واليوم نحن منصة إبداعية متكاملة.
            </p>
            <div class="values">
                <div class="value-item">
                    <span>💎</span> إبداع بلا حدود
                </div>
                <div class="value-item">
                    <span>⚡</span> أداء فائق
                </div>
                <div class="value-item">
                    <span>🤝</span> شراكة حقيقية
                </div>
                <div class="value-item">
                    <span>🔮</span> رؤية مستقبلية
                </div>
            </div>
            <p class="panel-footer-text">المقر: دبي • الرياض • القاهرة</p>
        </div>
    `;
}

function getContactContent() {
    return `
        <div class="panel-inner">
            <div class="panel-icon">📧</div>
            <h2 class="panel-title">اتصل بنا</h2>
            <p class="panel-subtitle">نحن ننتظر رسالتك</p>
            <form class="contact-form" id="contact-form">
                <div class="form-group">
                    <input type="text" placeholder="الاسم الكامل" required>
                </div>
                <div class="form-group">
                    <input type="email" placeholder="البريد الإلكتروني" required>
                </div>
                <div class="form-group">
                    <select>
                        <option value="">نوع الاستفسار</option>
                        <option>تطوير لعبة</option>
                        <option>برنامج مخصص</option>
                        <option>جهاز - منتج</option>
                        <option>شراكة</option>
                        <option>أخرى</option>
                    </select>
                </div>
                <div class="form-group">
                    <textarea placeholder="رسالتك..." rows="3"></textarea>
                </div>
                <button type="submit" class="panel-btn submit-btn">
                    🚀 أرسل الرسالة
                </button>
            </form>
            <div class="contact-info">
                <p>📧 info@cubestudios.com</p>
                <p>📱 +966 50 000 0000</p>
            </div>
        </div>
    `;
}