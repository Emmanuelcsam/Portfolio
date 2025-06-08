// insane_animations.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the about page
    if (document.querySelector('.resume-container')) {
        const prompt = document.getElementById('animation-prompt');
        const promptText = document.getElementById('prompt-text');
        const animationToggle = document.getElementById('animation-toggle');
        let isAtBottom = false;

        // --- Scroll Detection ---
        const handleScroll = () => {
            const atBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 5);
            if (atBottom && !isAtBottom) {
                prompt.classList.add('visible');
                isAtBottom = true;
            } else if (!atBottom && isAtBottom) {
                prompt.classList.remove('visible');
                isAtBottom = false;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        // --- Animation Logic ---
        let backgroundElement = null;
        let mouseMoveListener = null;

        const applyAnimations = () => {
            try {
                // Prevent duplicate backgrounds
                if (backgroundElement) return;

                // 1. Create and inject the animated background
                backgroundElement = document.createElement('div');
                backgroundElement.id = 'animated-background';
                document.body.insertAdjacentElement('afterbegin', backgroundElement);

                // Replicate styles from magic-portfolio's Background.tsx
                const dotsColor = 'rgba(50, 130, 184, 0.4)';
                const gradientColorStart = 'rgba(50, 130, 184, 0.3)';
                const gradientColorEnd = 'transparent';

                Object.assign(backgroundElement.style, {
                    backgroundImage: `radial-gradient(${dotsColor} 1px, transparent 1px), radial-gradient(ellipse 25% 25% at 50% 50%, ${gradientColorStart}, ${gradientColorEnd})`,
                    backgroundSize: '24px 24px, 400% 400%',
                    backgroundPosition: 'center, -150% -150%',
                    transformOrigin: 'center',
                    pointerEvents: 'none'
                });

                // 2. Add mouse move effect for the gradient
                mouseMoveListener = (e) => {
                    const { clientX, clientY } = e;
                    const x = (clientX / window.innerWidth) * 100;
                    const y = (clientY / window.innerHeight) * 100;
                    const adjustedX = 37.5 + (x / 100) * 25;
                    const adjustedY = 37.5 + (y / 100) * 25;
                    
                    if (backgroundElement) {
                         backgroundElement.style.backgroundPosition = `center, ${adjustedX}% ${adjustedY}%`;
                    }
                };
                window.addEventListener('mousemove', mouseMoveListener);

                // 3. Add a class to the body to fade in the background
                document.body.classList.add('animations-active');
                if (backgroundElement) backgroundElement.style.opacity = '1';

                // 4. Enhance other elements (e.g., hero title)
                const heroTitle = document.querySelector('.hero-title');
                if(heroTitle) heroTitle.style.animation = 'textShine 5s linear infinite';
                
            } catch (error) {
                console.error("Animation failed to apply:", error);
                if(promptText) promptText.textContent = "Sorry, your computer can't run these animations. Contact me and I'll show you what you're missing!";
                if(animationToggle) animationToggle.checked = false;
                removeAnimations(); // Clean up partial changes
            }
        };

        const removeAnimations = () => {
            document.body.classList.remove('animations-active');
            if (backgroundElement) {
                backgroundElement.style.opacity = '0';
                setTimeout(() => {
                    backgroundElement.remove();
                    backgroundElement = null;
                }, 1000);
            }
            if (mouseMoveListener) {
                window.removeEventListener('mousemove', mouseMoveListener);
                mouseMoveListener = null;
            }
             const heroTitle = document.querySelector('.hero-title');
             if(heroTitle) heroTitle.style.animation = 'none';
        };

        // --- Toggle Switch Handler ---
        animationToggle.addEventListener('change', () => {
            if (animationToggle.checked) {
                applyAnimations();
            } else {
                removeAnimations();
            }
        });
    }
});
