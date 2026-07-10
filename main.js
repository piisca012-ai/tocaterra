/* ==========================================================================
   Toca da Terra - Frontend Logic & Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Header & Mobile Menu Navigation --- */
    const header = document.querySelector('.main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // Header scroll background transition
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active link highlighting on scroll
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle Action
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Hamburger animation
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mobileMenuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu on clicking any navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    /* --- 2. Scroll Reveal Animation (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger animation once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* --- 3. Parallax Effect on Hero Background --- */
    const heroBg = document.querySelector('.hero-parallax-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            let scrollPosition = window.pageYOffset;
            // Move background slower than layout scroll (40% speed)
            heroBg.style.transform = `translateY(${scrollPosition * 0.4}px) scale(1.02)`;
        });
    }

    /* --- 4. "Ver Mais" Expandable Sections (Quem Somos & Princípios) --- */
    const setupExpandable = (btnId, wrapperId, expandText, collapseText) => {
        const btn = document.getElementById(btnId);
        const wrapper = document.getElementById(wrapperId);
        
        if (btn && wrapper) {
            btn.addEventListener('click', () => {
                wrapper.classList.toggle('expanded');
                
                const isExpanded = wrapper.classList.contains('expanded');
                btn.innerText = isExpanded ? collapseText : expandText;
                
                // Recalculate intersections and scroll positions
                setTimeout(() => {
                    window.dispatchEvent(new Event('scroll'));
                }, 100);
            });
        }
    };

    setupExpandable('btn-expand-about', 'about-expandable-content', 'Ver Mais', 'Ver Menos');
    setupExpandable('btn-expand-gallery', 'gallery-expandable-content', 'Ver Mais', 'Ver Menos');
    setupExpandable('btn-expand-feiras', 'feiras-expandable-content', 'Ver Mais', 'Ver Menos');
    setupExpandable('btn-expand-products', 'products-expandable-content', 'Ver Mais', 'Ver Menos');

    /* --- 5. Image Gallery Custom Lightbox --- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentGalleryIdx = 0;
    const galleryData = [];

    // Extract image metadata from DOM structure
    galleryItems.forEach((item, idx) => {
        const fullImgUrl = item.getAttribute('data-image');
        const captionText = item.getAttribute('data-caption');
        
        galleryData.push({
            url: fullImgUrl,
            caption: captionText
        });

        item.addEventListener('click', () => {
            currentGalleryIdx = idx;
            openLightbox();
        });
    });

    const openLightbox = () => {
        if (lightboxModal && lightboxImg && lightboxCaption) {
            const currentItem = galleryData[currentGalleryIdx];
            lightboxImg.src = currentItem.url;
            lightboxCaption.innerText = currentItem.caption;
            
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        }
    };

    const closeLightbox = () => {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    const nextImage = () => {
        currentGalleryIdx = (currentGalleryIdx + 1) % galleryData.length;
        updateLightboxContent();
    };

    const prevImage = () => {
        currentGalleryIdx = (currentGalleryIdx - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    };

    const updateLightboxContent = () => {
        if (lightboxImg && lightboxCaption) {
            const currentItem = galleryData[currentGalleryIdx];
            // Fade effect transition
            lightboxImg.style.opacity = '0.5';
            setTimeout(() => {
                lightboxImg.src = currentItem.url;
                lightboxCaption.innerText = currentItem.caption;
                lightboxImg.style.opacity = '1';
            }, 150);
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    
    // Close on clicking modal background overlay
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation shortcuts
    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });



    /* --- 7. Assistente Virtual (Toca da Terra Chatbot) 🌱 --- */
    const chatTrigger = document.getElementById('rafa-chat-trigger');
    const chatWindow = document.getElementById('rafa-chat-window');
    const chatClose = document.getElementById('rafa-close-btn');
    const chatForm = document.getElementById('rafa-chat-form');
    const chatInput = document.getElementById('rafa-chat-input');
    const chatMessages = document.getElementById('rafa-chat-messages');
    const chatQuickOpts = document.getElementById('rafa-quick-options');
    const welcomeTime = document.getElementById('welcome-time');

    // Conversation States
    let userName = "";
    let userInterest = "";
    let chatStep = 0; // 0: Free/MainMenu, 1: Expecting Name, 2: Expecting Interest Selection, 3: Completed

    // Answer Database
    const botReplies = {
        quem_somos: "A **Toca da Terra** é um espaço de comércio justo localizado em Feira de Santana - BA. Nós conectamos consumidores urbanos a alimentos processados e artesanatos vindos diretamente da agricultura familiar e cooperativas parceiras.",
        agricultura_familiar: "A **Agricultura Familiar** é a base do sustento no campo. É a produção realizada por pequenas famílias rurais, quilombolas, indígenas e comunidades tradicionais que cuidam da terra de forma sustentável, gerando mais biodiversidade e alimentos saudáveis.",
        economia_solidaria: "A **Economia Solidária** é um jeito ético de trabalhar e consumir! Ela prioriza a solidariedade, a cooperação coletiva e a autogestão democrática, dividindo os lucros igualmente e valorizando o trabalho humano em vez de focar apenas no lucro puro.",
        categorias: "Em nossa loja física você encontra:<br>• Temperos artesanais e naturais<br>• Laticínios e queijos da região<br>• Doces e geleias artesanais<br>• Roupas de tricô e crochê<br>• Artesanato regional e cerâmicas<br>• Carteiras e acessórios de couro<br>• Bonecas de pano artesanais<br>• Cafés especiais e chocolates de cooperativas.",
        horarios: "Nossa loja fica na **Rua Barão do Rio Branco, 1290 - Centro, Feira de Santana - BA**.<br><br>🕐 **Horário de funcionamento:**<br>• Segunda a Sexta: 09h às 18h<br>• Sábado: 09h às 13h<br>• Domingo: Fechado.",
        whatsapp: "Que legal que você quer falar conosco! Para te guiar melhor e te conectar com o atendimento ideal, por favor me diga: **Qual é o seu nome?**"
    };

    const getFormattedTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (welcomeTime) welcomeTime.innerText = getFormattedTime();

    // Open/Close chat container
    const toggleChat = () => {
        if (chatWindow) {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 200);
            }
        }
    };

    if (chatTrigger) chatTrigger.addEventListener('click', toggleChat);
    if (chatClose) chatClose.addEventListener('click', toggleChat);

    // Append standard message to UI
    const appendMsg = (sender, text) => {
        if (!chatMessages) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('rafa-message');
        msgDiv.classList.add(sender === 'bot' ? 'rafa-bot' : 'rafa-user');
        
        const textContainer = document.createElement('div');
        textContainer.classList.add('rafa-msg-text');
        textContainer.innerHTML = text;
        
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('rafa-msg-time');
        timeSpan.innerText = getFormattedTime();
        
        msgDiv.appendChild(textContainer);
        msgDiv.appendChild(timeSpan);
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Show bot typing animation delay
    const simulateBotReply = (htmlText, delay = 700) => {
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('rafa-message', 'rafa-bot', 'typing-indicator-msg');
        typingDiv.innerHTML = '<div class="rafa-msg-text">Digitando...</div>';
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        setTimeout(() => {
            typingDiv.remove();
            appendMsg('bot', htmlText);
        }, delay);
    };

    // Handle intent button clicks
    if (chatQuickOpts) {
        chatQuickOpts.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-opt-btn')) {
                const intent = e.target.getAttribute('data-intent');
                const btnLabel = e.target.innerText;
                
                appendMsg('user', btnLabel);
                
                if (intent === 'whatsapp') {
                    chatStep = 1; // Transition to name capture
                    simulateBotReply(botReplies[intent]);
                    chatQuickOpts.style.display = 'none'; // Clear options during form fill
                } else {
                    simulateBotReply(botReplies[intent]);
                }
            }
        });
    }

    // Text Input Form Handler
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userInputText = chatInput.value.trim();
            if (!userInputText) return;
            
            appendMsg('user', userInputText);
            chatInput.value = '';
            
            // Conversation Flow Controller
            if (chatStep === 0) {
                // Free text parsing
                const query = userInputText.toLowerCase();
                
                if (query.includes('oi') || query.includes('olá') || query.includes('bom dia') || query.includes('boa tarde')) {
                    simulateBotReply("Olá! Espero que você esteja bem. Em que posso te ajudar hoje? 🌱");
                } else if (query.includes('quem') || query.includes('toca') || query.includes('história')) {
                    simulateBotReply(botReplies.quem_somos);
                } else if (query.includes('familiar') || query.includes('agricultura')) {
                    simulateBotReply(botReplies.agricultura_familiar);
                } else if (query.includes('solidária') || query.includes('economia')) {
                    simulateBotReply(botReplies.economia_solidaria);
                } else if (query.includes('produto') || query.includes('artesanato') || query.includes('queijo') || query.includes('categoria')) {
                    simulateBotReply(botReplies.categorias);
                } else if (query.includes('horário') || query.includes('endereco') || query.includes('onde fica') || query.includes('funcionamento')) {
                    simulateBotReply(botReplies.horarios);
                } else if (query.includes('whatsapp') || query.includes('contato') || query.includes('falar') || query.includes('comprar')) {
                    chatStep = 1;
                    simulateBotReply("Perfeito! Para que eu possa te direcionar ao contato direto pelo WhatsApp, como posso te chamar? Diga-me seu nome.");
                    chatQuickOpts.style.display = 'none';
                } else {
                    chatStep = 1;
                    simulateBotReply("Entendi! Vamos te conectar ao nosso atendimento humano via WhatsApp. Primeiramente, qual é o seu nome?");
                    chatQuickOpts.style.display = 'none';
                }
            } else if (chatStep === 1) {
                userName = userInputText;
                chatStep = 2;
                
                const promptHTML = `Muito prazer, **${userName}**! 🌱<br><br>Para te direcionarmos ao contato correto no WhatsApp, selecione qual é o seu principal assunto de interesse:`;
                
                simulateBotReply(promptHTML);
                
                // Re-build quick options for interest Selection
                setTimeout(() => {
                    chatQuickOpts.innerHTML = `
                        <button class="quick-opt-btn" id="opt-buy">Comprar produtos (Consumidor)</button>
                        <button class="quick-opt-btn" id="opt-collab">Fazer parceria (Produtor/Cooperativa)</button>
                        <button class="quick-opt-btn" id="opt-visit">Quero visitar a loja física</button>
                        <button class="quick-opt-btn" id="opt-other">Outras dúvidas</button>
                    `;
                    chatQuickOpts.style.display = 'flex';
                    
                    document.getElementById('opt-buy').addEventListener('click', () => handleSelectedInterest('Comprar produtos (Cestas/Artesanatos)'));
                    document.getElementById('opt-collab').addEventListener('click', () => handleSelectedInterest('Fazer parceria como Produtor/Cooperativa'));
                    document.getElementById('opt-visit').addEventListener('click', () => handleSelectedInterest('Saber informações para visitar a loja'));
                    document.getElementById('opt-other').addEventListener('click', () => handleSelectedInterest('Outros assuntos e informações gerais'));
                }, 850);
            } else if (chatStep === 2) {
                userInterest = userInputText;
                completeAssistantFlow();
            }
        });
    }

    const handleSelectedInterest = (interestText) => {
        appendMsg('user', interestText);
        userInterest = interestText;
        completeAssistantFlow();
    };

    const completeAssistantFlow = () => {
        chatStep = 3;
        chatQuickOpts.style.display = 'none';
        
        const messagePayload = `Olá! Meu nome é ${userName} e vim pelo site da Toca da Terra. Tenho interesse em: ${userInterest}.`;
        const encodedUrl = `https://wa.me/5575981702807?text=${encodeURIComponent(messagePayload)}`;
        
        const responseHTML = `Maravilha, **${userName}**! Registrei seu interesse por: *${userInterest}*.<br><br>Clique no botão abaixo para ir direto para o WhatsApp do nosso atendimento humanizado! 😊<br><br><a href="${encodedUrl}" target="_blank" class="btn btn-whatsapp" style="display:inline-flex; border-radius: 20px; font-size: 13px; padding: 10px 18px; margin-top: 8px;"><i class="fab fa-whatsapp"></i> Iniciar Conversa</a>`;
        
        simulateBotReply(responseHTML, 800);
    };

});
