// بوت المحاسبة باستخدام Gemma 3 27B
const API_KEY = "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";
const MODEL = "Gemma 3 27B";

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

// تهيئة البوت عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأخير إنشاء البوت للتأكد من تحميل الصفحة بالكامل
    setTimeout(() => {
        initializeBot();
        console.log('تم تهيئة البوت');
    }, 1000);
});

// تهيئة البوت
function initializeBot() {
    // إنشاء عناصر البوت
    createBotElements();

    // إضافة الأحداث
    document.querySelector('.bot-toggle').addEventListener('click', toggleBot);
    document.querySelector('.bot-close').addEventListener('click', toggleBot);
    document.getElementById('bot-input').addEventListener('keypress', handleKeyPress);
    document.querySelector('.bot-send').addEventListener('click', sendMessage);

    // إضافة رسالة الترحيب
    setTimeout(() => {
        addMessage("مرحباً بك في آفاق للمحاسبة! كيف يمكنني مساعدتك اليوم؟", false);
        showOptions();
    }, 500);
}

// إنشاء عناصر البوت
function createBotElements() {
    // إنشاء زر التبديل
    const toggleButton = document.createElement('div');
    toggleButton.className = 'bot-toggle';
    toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
    document.body.appendChild(toggleButton);

    // إنشاء نافذة البوت
    const botContainer = document.createElement('div');
    botContainer.className = 'bot-container';
    botContainer.innerHTML = `
        <div class="bot-header">
            <h3>مساعد المحاسبة (Gemma 3 27B)</h3>
            <button class="bot-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="bot-messages" id="bot-messages"></div>
        <div class="bot-input-container">
            <input type="text" id="bot-input" placeholder="اكتب رسالتك هنا...">
            <button class="bot-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    document.body.appendChild(botContainer);

    // إضافة تنسيقات CSS
    const style = document.createElement('style');
    style.textContent = `
        .bot-toggle {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(to right, #1a237e, #0d47a1);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            font-size: 24px;
            transition: all 0.3s ease;
        }

        .bot-toggle:hover {
            transform: scale(1.1);
        }

        .bot-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            overflow: hidden;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            transform: scale(0);
            transform-origin: bottom left;
            transition: transform 0.3s ease;
        }

        .bot-container.active {
            transform: scale(1);
        }

        .bot-header {
            background: linear-gradient(to right, #1a237e, #0d47a1);
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .bot-header h3 {
            margin: 0;
            font-size: 1.2rem;
        }

        .bot-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
        }

        .bot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .bot-message {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
            max-width: 80%;
        }

        .bot-message.user {
            align-self: flex-end;
        }

        .bot-message.bot {
            align-self: flex-start;
        }

        .message-content {
            padding: 10px 15px;
            border-radius: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .bot-message.user .message-content {
            background: #e9f5ff;
            color: #333;
            border-top-right-radius: 0;
        }

        .bot-message.bot .message-content {
            background: #f0f0f0;
            color: #333;
            border-top-left-radius: 0;
        }

        .bot-input-container {
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
        }

        #bot-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }

        .bot-send {
            background: linear-gradient(to right, #1a237e, #0d47a1);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .options-container {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }

        .bot-option {
            background: #e9f5ff;
            border: none;
            padding: 8px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }

        .bot-option:hover {
            background: #d0e8ff;
            transform: translateY(-2px);
        }

        .typing-indicator .message-content {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 50px;
        }

        .typing-indicator .message-content span {
            height: 8px;
            width: 8px;
            margin: 0 2px;
            background-color: #888;
            border-radius: 50%;
            display: inline-block;
            animation: typing 1.4s infinite ease-in-out both;
        }

        .typing-indicator .message-content span:nth-child(1) {
            animation-delay: 0s;
        }

        .typing-indicator .message-content span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-indicator .message-content span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0% { transform: scale(0); }
            50% { transform: scale(1); }
            100% { transform: scale(0); }
        }
    `;
    document.head.appendChild(style);
}

// تبديل حالة البوت (مفتوح/مغلق)
function toggleBot() {
    const botContainer = document.querySelector('.bot-container');
    const botToggle = document.querySelector('.bot-toggle');

    if (botContainer.classList.contains('active')) {
        botContainer.classList.remove('active');
        setTimeout(() => {
            botToggle.style.display = 'flex';
        }, 300); // انتظار انتهاء التأثير الحركي
    } else {
        botContainer.classList.add('active');
        botToggle.style.display = 'none';
    }

    // طباعة رسالة للتأكد من تنفيذ الوظيفة
    console.log('تم تبديل حالة البوت');
}

// إضافة رسالة إلى المحادثة
function addMessage(message, isUser = false) {
    const botMessages = document.getElementById('bot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `bot-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
    `;
    botMessages.appendChild(messageDiv);
    botMessages.scrollTop = botMessages.scrollHeight;
}

// عرض خيارات للمستخدم
function showOptions() {
    const options = [
        '1️⃣ معلومات عن الشركة',
        '2️⃣ خدماتنا وأسعارنا',
        '3️⃣ طلب استشارة مجانية',
        '4️⃣ التواصل معنا',
        '5️⃣ ساعات العمل'
    ];

    const optionsHtml = options.map(option =>
        `<button class="bot-option" onclick="handleOption('${option}')">${option}</button>`
    ).join('');

    addMessage(`اختر من القائمة التالية:
        <div class="options-container">${optionsHtml}</div>`, false);
}

// معالجة الخيارات
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

// معالجة ضغط Enter
async function handleKeyPress(event) {
    if (event.key === 'Enter') {
        await sendMessage();
    }
}

// إرسال رسالة
async function sendMessage() {
    const userInput = document.getElementById('bot-input');
    const message = userInput.value.trim();

    if (message) {
        // إضافة رسالة المستخدم
        addMessage(message, true);

        // إظهار مؤشر الكتابة
        const botMessages = document.getElementById('bot-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'bot-message bot typing-indicator';
        typingIndicator.innerHTML = '<div class="message-content"><span></span><span></span><span></span></div>';
        botMessages.appendChild(typingIndicator);
        botMessages.scrollTop = botMessages.scrollHeight;

        try {
            // الحصول على رد من Gemma
            const response = await getGemmaResponse(message);

            // إزالة مؤشر الكتابة
            botMessages.removeChild(typingIndicator);

            // إضافة رد البوت
            addMessage(response);
        } catch (error) {
            // إزالة مؤشر الكتابة
            botMessages.removeChild(typingIndicator);

            // إضافة رسالة خطأ
            addMessage("عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
            console.error(error);
        }

        userInput.value = '';
    }
}

// الحصول على رد من Gemma
async function getGemmaResponse(userMessage) {
    // إعداد سياق المحادثة
    const systemPrompt = `
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
        // الاتصال بواجهة برمجة التطبيقات
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // استخدام نموذج متوافق مع واجهة OpenAI
                messages: [
                    { role: "system", content: systemPrompt },
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
        return "عذراً، لم أفهم سؤالك. يمكنك اختيار من القائمة أعلاه أو إعادة صياغة سؤالك.";
    }
}
