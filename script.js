// التحقق من صحة نموذج الاتصال
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // التحقق من الحقول
    const formElements = this.elements;
    let isValid = true;
    
    for (let element of formElements) {
        if (element.hasAttribute('required') && !element.value.trim()) {
            isValid = false;
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }
        
        // التحقق من صحة البريد الإلكتروني
        if (element.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(element.value)) {
                isValid = false;
                element.classList.add('is-invalid');
            }
        }
    }
    
    if (isValid) {
        // هنا يمكن إضافة كود إرسال النموذج إلى الخادم
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
        this.reset();
    }
});

// تنعيم التمرير عند النقر على روابط القائمة
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// تحريك القائمة العلوية عند التمرير
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        navbar.style.top = '-100px';
    } else {
        navbar.style.top = '0';
    }
    lastScrollTop = scrollTop;
});

// إضافة تأثيرات ظهور العناصر عند التمرير
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.service-card, #about img, #contactForm');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// التعامل مع الأسئلة الشائعة
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        // إغلاق كل الإجابات الأخرى
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== question.parentElement) {
                item.classList.remove('active');
            }
        });
        
        // تبديل حالة السؤال الحالي
        question.parentElement.classList.toggle('active');
        
        // تدوير الأيقونة
        const icon = question.querySelector('.faq-icon');
        if (question.parentElement.classList.contains('active')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0)';
        }
    });
});

// تصفية معرض الأعمال
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // إظهار كل المشاريع عند تحميل الصفحة
    portfolioItems.forEach(item => item.style.display = 'block');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس active من كل الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الكلاس active للزر المحدد
            button.classList.add('active');

            const category = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('show'), 0);
                } else if (item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('show'), 0);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
});

// وظائف البوت
let isChatOpen = false;

// معلومات الشركة
const companyInfo = {
    name: "آفاق للتسويق الرقمي",
    owner: "أيمن الصلوي",
    phone: "00967777991788",
    whatsapp: "00967777991788",
    email: "aymanalsalawi@gmail.com",
    location: "المملكة العربية السعودية",
    workHours: "من الأحد إلى الخميس: 9 صباحاً - 6 مساءً"
};

// قائمة الخدمات
const services = {
    social: {
        title: "إدارة السوشيال ميديا",
        price: "يبدأ من 1500 ريال شهرياً",
        description: "إدارة احترافية لحسابات التواصل الاجتماعي، تصميم المحتوى، زيادة المتابعين والتفاعل"
    },
    seo: {
        title: "تحسين محركات البحث",
        price: "يبدأ من 2000 ريال شهرياً",
        description: "تحسين ظهور موقعك في نتائج البحث، تحليل الكلمات المفتاحية، تحسين المحتوى"
    },
    ads: {
        title: "إدارة الحملات الإعلانية",
        price: "يبدأ من 1000 ريال شهرياً",
        description: "إدارة إعلانات جوجل وسناب شات وتويتر وانستقرام بكفاءة عالية"
    },
    web: {
        title: "تصميم المواقع",
        price: "يبدأ من 3000 ريال",
        description: "تصميم مواقع احترافية متجاوبة مع جميع الأجهزة، متوافقة مع محركات البحث"
    }
};

function toggleChat() {
    const chatWidget = document.querySelector('.chat-widget');
    const chatToggle = document.querySelector('.chat-toggle');
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatWidget.classList.add('active');
        chatToggle.style.transform = 'scale(0)';
    } else {
        chatWidget.classList.remove('active');
        chatToggle.style.transform = 'scale(1)';
    }
}

function showOptions() {
    const options = [
        '1️⃣ معلومات عن الشركة',
        '2️⃣ خدماتنا وأسعارنا',
        '3️⃣ طلب استشارة مجانية',
        '4️⃣ التواصل معنا',
        '5️⃣ ساعات العمل'
    ];
    
    const optionsHtml = options.map(option => 
        `<button class="chat-option" onclick="handleOption('${option}')">${option}</button>`
    ).join('');
    
    addMessage(`اختر من القائمة التالية:
        <div class="options-container">${optionsHtml}</div>`, false);
}

function handleOption(option) {
    switch(option[0]) {
        case '1':
            addMessage(`🏢 ${companyInfo.name}
                \nالمالك: ${companyInfo.owner}
                \nموقعنا: ${companyInfo.location}`);
            break;
        case '2':
            let servicesText = "خدماتنا وأسعارنا:\n\n";
            for (let key in services) {
                const service = services[key];
                servicesText += `📌 ${service.title}\n💰 ${service.price}\n${service.description}\n\n`;
            }
            addMessage(servicesText);
            break;
        case '3':
            addMessage("يسعدنا تقديم استشارة مجانية! يرجى ترك رقم جوالك وسنتواصل معك خلال 24 ساعة.");
            break;
        case '4':
            addMessage(`📞 للتواصل معنا:
                \n☎️ هاتف: ${companyInfo.phone}
                \n📱 واتساب: ${companyInfo.whatsapp}
                \n📧 إيميل: ${companyInfo.email}`);
            break;
        case '5':
            addMessage(`⏰ ساعات العمل:
                \n${companyInfo.workHours}`);
            break;
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // الكلمات المفتاحية والردود
    const keywords = {
        'سعر': `أسعارنا تنافسية وتختلف حسب الخدمة:\n${Object.values(services).map(s => `${s.title}: ${s.price}`).join('\n')}`,
        'خدمات': `نقدم خدمات متنوعة تشمل:\n${Object.values(services).map(s => `- ${s.title}`).join('\n')}`,
        'تواصل': `يمكنك التواصل معنا عبر:\nهاتف: ${companyInfo.phone}\nواتساب: ${companyInfo.whatsapp}\nإيميل: ${companyInfo.email}`,
        'موقع': `موقعنا في ${companyInfo.location}`,
        'دوام': companyInfo.workHours,
        'استشارة': 'يسعدنا تقديم استشارة مجانية! يرجى ترك رقم جوالك وسنتواصل معك خلال 24 ساعة.',
    };

    // البحث عن كلمات مفتاحية في رسالة المستخدم
    for (let keyword in keywords) {
        if (lowerMessage.includes(keyword)) {
            return keywords[keyword];
        }
    }

    // عرض الخيارات إذا لم يتم العثور على كلمات مفتاحية
    showOptions();
    return "لم أفهم سؤالك بشكل واضح. يمكنك اختيار من القائمة أعلاه أو إعادة صياغة سؤالك.";
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        // إضافة رسالة المستخدم
        addMessage(message, true);
        
        // إضافة رسالة البوت
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
        }, 500);
        
        userInput.value = '';
    }
}

// عرض الخيارات عند بدء المحادثة
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(showOptions, 1000);
});

// وظيفة تبديل الوضع الليلي
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// تحقق من الوضع المحفوظ عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.className = 'fas fa-sun';
    }
});
