// التحقق من صحة نموذج الاتصال وإرسال البيانات عبر جميع وسائل التواصل
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // التحقق من الحقول
    const formElements = this.elements;
    let isValid = true;

    // جمع بيانات النموذج
    const formData = {
        name: formElements.namedItem('fullName').value,
        email: formElements.namedItem('email').value,
        phone: formElements.namedItem('phone').value,
        service: formElements.namedItem('service').value,
        message: formElements.namedItem('message').value
    };

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
        // إرسال البيانات عبر جميع وسائل التواصل
        sendToAllChannels(formData);

        // إعادة تعيين النموذج (لن يكون مرئياً بعد الآن)
        this.reset();
    }
});

// إرسال البيانات عبر جميع وسائل التواصل
function sendToAllChannels(formData) {
    // إنشاء الروابط لجميع وسائل التواصل
    const emailSubject = `استفسار جديد من ${formData.name} - ${formData.service}`;
    const emailBody = `
اسم العميل: ${formData.name}
البريد الإلكتروني: ${formData.email}
رقم الهاتف: ${formData.phone}
الخدمة المطلوبة: ${formData.service}
الرسالة: ${formData.message}
    `;
    const emailLink = `mailto:aymanalsalawi@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const whatsappMessage = `*استفسار جديد من موقع آفاق للمحاسبة*

الاسم: ${formData.name}
البريد الإلكتروني: ${formData.email}
رقم الهاتف: ${formData.phone}
الخدمة المطلوبة: ${formData.service}

الرسالة:
${formData.message}`;
    const whatsappLink = `https://wa.me/00967777991788?text=${encodeURIComponent(whatsappMessage)}`;

    const telegramMessage = `استفسار جديد من موقع آفاق للمحاسبة

الاسم: ${formData.name}
البريد الإلكتروني: ${formData.email}
رقم الهاتف: ${formData.phone}
الخدمة المطلوبة: ${formData.service}

الرسالة:
${formData.message}`;
    const telegramLink = `https://t.me/Aymanalse?text=${encodeURIComponent(telegramMessage)}`;

    // 5. حفظ البيانات في التخزين المحلي للمتصفح (للاحتياط)
    const contactRequests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    contactRequests.push({
        ...formData,
        date: new Date().toISOString()
    });
    localStorage.setItem('contactRequests', JSON.stringify(contactRequests));

    // إنشاء عناصر HTML للروابط
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-3';
    successMessage.innerHTML = `
        <h4 class="alert-heading">تم استلام رسالتك بنجاح!</h4>
        <p>شكراً لتواصلك معنا. يرجى اختيار إحدى وسائل التواصل التالية لإرسال بياناتك:</p>
        <div class="d-flex flex-wrap justify-content-center mt-3">
            <a href="${emailLink}" class="btn btn-primary m-2" target="_blank">
                <i class="fas fa-envelope me-2"></i> إرسال عبر البريد الإلكتروني
            </a>
            <a href="${whatsappLink}" class="btn btn-success m-2" target="_blank">
                <i class="fab fa-whatsapp me-2"></i> إرسال عبر واتساب
            </a>
            <a href="${telegramLink}" class="btn btn-info m-2" target="_blank">
                <i class="fab fa-telegram me-2"></i> إرسال عبر تلجرام
            </a>
            <a href="tel:+967777991788" class="btn btn-danger m-2">
                <i class="fas fa-phone me-2"></i> اتصل بنا مباشرة
            </a>
        </div>
        <div class="mt-3">
            <p>أو يمكنك نسخ الرسالة التالية وإرسالها عبر أي وسيلة تواصل:</p>
            <textarea class="form-control" rows="8" readonly>${whatsappMessage}</textarea>
            <button class="btn btn-secondary mt-2" onclick="copyMessage(this)">نسخ الرسالة</button>
        </div>
    `;

    // إضافة رسالة النجاح إلى النموذج
    const contactForm = document.getElementById('contactForm');
    contactForm.style.display = 'none'; // إخفاء النموذج
    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);

    // تسجيل البيانات في وحدة التحكم (للتأكيد)
    console.log('تم استلام البيانات:', formData);
}

// وظيفة نسخ الرسالة
function copyMessage(button) {
    const textarea = button.previousElementSibling;
    textarea.select();
    document.execCommand('copy');

    // تغيير نص الزر مؤقتاً
    const originalText = button.textContent;
    button.textContent = 'تم النسخ!';
    button.classList.add('btn-success');
    button.classList.remove('btn-secondary');

    // إعادة النص الأصلي بعد ثانيتين
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.add('btn-secondary');
        button.classList.remove('btn-success');
    }, 2000);
}



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
    name: "آفاق للمحاسبة",
    owner: "أيمن الصلوي",
    phone: "00967777991788",
    whatsapp: "00967777991788",
    email: "aymanalsalawi@gmail.com",
    location: "المملكة العربية السعودية",
    workHours: "من الأحد إلى الخميس: 9 صباحاً - 6 مساءً"
};

// قائمة الخدمات
const services = {
    accounting: {
        title: "مسك الدفاتر المحاسبية",
        price: "يبدأ من 1500 ريال شهرياً",
        description: "خدمات مسك الدفاتر المحاسبية بدقة عالية، تسجيل المعاملات المالية، وإعداد القيود المحاسبية"
    },
    tax: {
        title: "الخدمات الضريبية",
        price: "يبدأ من 2000 ريال شهرياً",
        description: "إعداد الإقرارات الضريبية، التخطيط الضريبي، والتعامل مع الجهات الضريبية المختلفة"
    },
    audit: {
        title: "خدمات المراجعة والتدقيق",
        price: "يبدأ من 3000 ريال",
        description: "مراجعة وتدقيق الحسابات، إعداد التقارير المالية، وتقييم نظم الرقابة الداخلية"
    },
    consulting: {
        title: "الاستشارات المالية",
        price: "يبدأ من 1000 ريال للجلسة",
        description: "تقديم استشارات مالية متخصصة، تحليل الأداء المالي، ووضع الخطط المالية المستقبلية"
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

async function handleKeyPress(event) {
    if (event.key === 'Enter') {
        await sendMessage();
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

// استخدام Gemma 3 27B للحصول على ردود أكثر ذكاءً
async function getBotResponse(userMessage) {
    const API_KEY = "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";
    const MODEL = "Gemma 3 27B";

    // إعداد سياق المحادثة مع معلومات عن الشركة والخدمات
    const companyContext = `
        أنت مساعد محاسبة ذكي لشركة ${companyInfo.name}.
        معلومات الشركة:
        - اسم الشركة: ${companyInfo.name}
        - المالك: ${companyInfo.owner}
        - الموقع: ${companyInfo.location}
        - ساعات العمل: ${companyInfo.workHours}
        - رقم الهاتف: ${companyInfo.phone}
        - البريد الإلكتروني: ${companyInfo.email}

        الخدمات المقدمة:
        1. ${services.accounting.title}: ${services.accounting.price}
           ${services.accounting.description}

        2. ${services.tax.title}: ${services.tax.price}
           ${services.tax.description}

        3. ${services.audit.title}: ${services.audit.price}
           ${services.audit.description}

        4. ${services.consulting.title}: ${services.consulting.price}
           ${services.consulting.description}

        أجب على استفسارات العملاء بشكل مهذب ومفيد. قدم معلومات دقيقة عن الخدمات والأسعار.
        إذا طلب العميل استشارة، اطلب منه ترك رقم هاتفه للتواصل معه.
        إذا لم تعرف الإجابة، اقترح التواصل المباشر مع الشركة.
        أجب باللغة العربية دائماً وبشكل مختصر.
    `;

    try {
        // محاولة الاتصال بـ API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // استخدام نموذج متوافق مع واجهة OpenAI
                messages: [
                    { role: "system", content: companyContext },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error("لم يتم الحصول على رد من النموذج");
        }
    } catch (error) {
        console.error("خطأ في الاتصال بالنموذج:", error);

        // استخدام الردود الاحتياطية في حالة فشل الاتصال
        const lowerMessage = userMessage.toLowerCase();
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
        return "عذراً، حدث خطأ في الاتصال. يمكنك اختيار من القائمة أعلاه أو التواصل معنا مباشرة.";
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (message) {
        // إضافة رسالة المستخدم
        addMessage(message, true);

        // إظهار مؤشر الكتابة
        const chatMessages = document.getElementById('chatMessages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message bot typing-indicator';
        typingIndicator.innerHTML = '<div class="message-content"><span>.</span><span>.</span><span>.</span></div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // الحصول على رد البوت
            const botResponse = await getBotResponse(message);

            // إزالة مؤشر الكتابة
            chatMessages.removeChild(typingIndicator);

            // إضافة رد البوت
            addMessage(botResponse);
        } catch (error) {
            // إزالة مؤشر الكتابة
            chatMessages.removeChild(typingIndicator);

            // إضافة رسالة خطأ
            addMessage("عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
            console.error(error);
        }

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
