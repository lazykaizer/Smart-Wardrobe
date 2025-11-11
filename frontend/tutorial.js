/**
 * Smart Wardrobe Tutorial System
 * Minimal tooltip-only approach - NO overlay, NO spotlight
 */

class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.tutorialSteps = [];
        this.isActive = false;
        this.tutorialKey = 'tutorialCompleted';
        
        this.init();
    }

    init() {
        // Only show tutorial for new users who haven't completed it
        if (!this.hasCompletedTutorial()) {
            this.setupTutorialSteps();
            this.showTutorial();
        } else {
            console.log('✅ Tutorial already completed for this user');
        }
    }

    hasCompletedTutorial() {
        return userDB.loadUserData(this.tutorialKey, false);
    }

    markTutorialComplete() {
        userDB.saveUserData(this.tutorialKey, true);
    }

    setupTutorialSteps() {
        this.tutorialSteps = [
            {
                title: "Welcome to Smart Wardrobe! 👋",
                content: "Your AI-powered wardrobe assistant! This quick tour will show you all the amazing features available in your dashboard.",
                target: ".app-title",
                position: "bottom"
            },
            {
                title: "Dashboard - Your Command Center 📊",
                content: "Your main hub! Here you'll see weather, calendar, and AI-generated outfit suggestions. Everything you need for daily style decisions!",
                target: ".dashboard-content",
                position: "top"
            },
            {
                title: "My Wardrobe - Your Digital Closet 👗",
                content: "Click here to manage your clothing collection! Upload photos, organize by categories, and keep track of everything you own.",
                target: "a[href='wardrobe.html']",
                position: "right"
            },
            {
                title: "AI Outfit Generator - Your Style Expert ✨",
                content: "Get personalized outfit recommendations! AI considers weather, events, and your preferences to create perfect looks for any occasion.",
                target: "a[href='ai-stylist.html']",
                position: "right"
            },
            {
                title: "Analytics & Insights - Track Your Style 📈",
                content: "Monitor your style preferences, most-worn items, and get insights about your wardrobe usage. Data-driven style decisions!",
                target: "a[href='style-guide.html']",
                position: "right"
            },
            {
                title: "AI Cloth Changer - Virtual Try-On 🔄",
                content: "Try on different clothes virtually! Upload your photo and see how different outfits look on you before making decisions.",
                target: "a[href='ai-cloth-changer.html']",
                position: "right"
            },
            {
                title: "Settings - Customize Your Experience ⚙️",
                content: "Manage your account, restart tutorials, and customize your Smart Wardrobe experience. Many more features coming soon!",
                target: "a[href='settings.html']",
                position: "right"
            },
            {
                title: "You're Ready for Your Style Journey! 🎉",
                content: "Congratulations! You now know all the main features. Start building your perfect wardrobe and let AI help you look amazing every day!",
                target: ".app-title",
                position: "bottom"
            }
        ];
    }

    showTutorial() {
        this.isActive = true;
        this.createMinimalTutorial();
        this.showStep(0);
    }

    createMinimalTutorial() {
        // Create minimal tutorial container - NO overlay
        const container = document.createElement('div');
        container.id = 'tutorial-minimal';
        container.innerHTML = `
            <div class="tutorial-tooltip-minimal">
                <div class="tutorial-tooltip-header">
                    <div class="tutorial-progress">
                        <div class="tutorial-progress-bar">
                            <div class="tutorial-progress-fill"></div>
                        </div>
                        <span class="tutorial-step-counter">1 / ${this.tutorialSteps.length}</span>
                    </div>
                    <button class="tutorial-skip-btn" id="tutorial-skip">
                        <i class="fas fa-times"></i>
                        Skip
                    </button>
                </div>
                <div class="tutorial-tooltip-content">
                    <h3 class="tutorial-title"></h3>
                    <p class="tutorial-text"></p>
                </div>
                <div class="tutorial-tooltip-footer">
                    <button class="tutorial-btn tutorial-btn-secondary" id="tutorial-prev" style="display: none;">
                        <i class="fas fa-chevron-left"></i>
                        Previous
                    </button>
                    <div class="tutorial-nav-dots"></div>
                    <button class="tutorial-btn tutorial-btn-primary" id="tutorial-next">
                        Next
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.addMinimalStyles();
        this.bindEvents();
    }

    addMinimalStyles() {
        const styles = `
            #tutorial-minimal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                pointer-events: none;
            }

            .tutorial-tooltip-minimal {
                position: absolute;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 12px;
                padding: 20px;
                max-width: 350px;
                width: 90%;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                border: 2px solid #a855f7;
                pointer-events: all;
                animation: tooltipFloat 0.4s ease-out;
            }

            @keyframes tooltipFloat {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .tutorial-tooltip-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .tutorial-progress {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .tutorial-progress-bar {
                width: 80px;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            }

            .tutorial-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #a855f7, #06b6d4);
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            .tutorial-step-counter {
                color: rgba(255, 255, 255, 0.7);
                font-size: 11px;
                font-weight: 500;
            }

            .tutorial-skip-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.7);
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .tutorial-skip-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.9);
            }

            .tutorial-tooltip-content {
                margin-bottom: 16px;
            }

            .tutorial-title {
                color: #ffffff;
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 6px 0;
                line-height: 1.3;
            }

            .tutorial-text {
                color: rgba(255, 255, 255, 0.8);
                font-size: 13px;
                line-height: 1.4;
                margin: 0;
            }

            .tutorial-tooltip-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .tutorial-btn {
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                border: none;
            }

            .tutorial-btn-primary {
                background: linear-gradient(135deg, #a855f7, #06b6d4);
                color: white;
            }

            .tutorial-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
            }

            .tutorial-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .tutorial-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.9);
            }

            .tutorial-nav-dots {
                display: flex;
                gap: 4px;
            }

            .tutorial-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .tutorial-dot.active {
                background: #a855f7;
                transform: scale(1.4);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .tutorial-tooltip-minimal {
                    padding: 16px;
                    margin: 16px;
                }
                
                .tutorial-title {
                    font-size: 14px;
                }
                
                .tutorial-text {
                    font-size: 12px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    bindEvents() {
        document.getElementById('tutorial-next').addEventListener('click', () => this.nextStep());
        document.getElementById('tutorial-prev').addEventListener('click', () => this.prevStep());
        document.getElementById('tutorial-skip').addEventListener('click', () => this.skipTutorial());
        
        // Create navigation dots
        this.createNavDots();
    }

    createNavDots() {
        const dotsContainer = document.querySelector('.tutorial-nav-dots');
        dotsContainer.innerHTML = '';
        
        this.tutorialSteps.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `tutorial-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToStep(index));
            dotsContainer.appendChild(dot);
        });
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.tutorialSteps.length) return;
        
        this.currentStep = stepIndex;
        const step = this.tutorialSteps[stepIndex];
        
        // No page navigation - tutorial stays on dashboard
        
        // Update content
        document.querySelector('.tutorial-title').textContent = step.title;
        document.querySelector('.tutorial-text').textContent = step.content;
        
        // Update progress
        const progress = ((stepIndex + 1) / this.tutorialSteps.length) * 100;
        document.querySelector('.tutorial-progress-fill').style.width = `${progress}%`;
        document.querySelector('.tutorial-step-counter').textContent = `${stepIndex + 1} / ${this.tutorialSteps.length}`;
        
        // Update buttons
        const prevBtn = document.getElementById('tutorial-prev');
        const nextBtn = document.getElementById('tutorial-next');
        
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'flex';
        
        if (stepIndex === this.tutorialSteps.length - 1) {
            nextBtn.innerHTML = '<i class="fas fa-check"></i> Finish';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        }
        
        // Update dots
        document.querySelectorAll('.tutorial-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === stepIndex);
        });
        
        // Highlight target element and position tooltip
        this.highlightElement(step.target);
        this.positionTooltip(step.target, step.position);
    }

    // Navigation function removed - tutorial stays on dashboard only

    positionTooltip(selector, position) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const tooltip = document.querySelector('.tutorial-tooltip-minimal');
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Scroll element into view first
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Wait for scroll to complete, then position tooltip
        setTimeout(() => {
            const newRect = element.getBoundingClientRect();
            this.positionTooltipAt(newRect, position);
        }, 300);
    }

    highlightElement(selector) {
        // Remove previous highlight
        this.removeHighlight();
        
        const element = document.querySelector(selector);
        if (!element) return;
        
        // Store original styles
        this.currentElement = element;
        this.originalStyles = {
            position: element.style.position,
            zIndex: element.style.zIndex,
            boxShadow: element.style.boxShadow,
            border: element.style.border,
            borderRadius: element.style.borderRadius,
            transform: element.style.transform,
            transition: element.style.transition
        };
        
        // Add highlight styles
        element.style.position = 'relative';
        element.style.zIndex = '9999';
        element.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)';
        element.style.border = '3px solid #a855f7';
        element.style.borderRadius = '12px';
        element.style.transform = 'scale(1.02)';
        element.style.transition = 'all 0.3s ease';
        
        // Add pulsing animation
        element.classList.add('tutorial-highlight');
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight styles to CSS
        this.addHighlightStyles();
    }

    removeHighlight() {
        if (this.currentElement && this.originalStyles) {
            // Restore original styles
            Object.keys(this.originalStyles).forEach(property => {
                this.currentElement.style[property] = this.originalStyles[property];
            });
            
            // Remove highlight class
            this.currentElement.classList.remove('tutorial-highlight');
            
            this.currentElement = null;
            this.originalStyles = null;
        }
    }

    addHighlightStyles() {
        if (!document.querySelector('#tutorial-highlight-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'tutorial-highlight-styles';
            styleSheet.textContent = `
                .tutorial-highlight {
                    animation: tutorialPulse 2s ease-in-out infinite;
                }
                
                @keyframes tutorialPulse {
                    0% {
                        box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4);
                        transform: scale(1.02);
                    }
                    50% {
                        box-shadow: 0 0 40px rgba(168, 85, 247, 1), 0 0 80px rgba(168, 85, 247, 0.6);
                        transform: scale(1.05);
                    }
                    100% {
                        box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4);
                        transform: scale(1.02);
                    }
                }
                
                /* Add a subtle overlay to dim other elements */
                .tutorial-highlight::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.1);
                    z-index: -1;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

    positionTooltipAt(rect, position) {
        const tooltip = document.querySelector('.tutorial-tooltip-minimal');
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 16;
        
        switch (position) {
            case 'right':
                let rightX = rect.right + 16;
                if (rightX + tooltipRect.width > viewportWidth - margin) {
                    rightX = rect.left - tooltipRect.width - 16;
                }
                tooltip.style.left = `${Math.max(margin, rightX)}px`;
                tooltip.style.top = `${Math.max(margin, Math.min(viewportHeight - tooltipRect.height - margin, rect.top + rect.height / 2 - tooltipRect.height / 2))}px`;
                tooltip.style.transform = 'none';
                break;
            case 'left':
                let leftX = rect.left - tooltipRect.width - 16;
                if (leftX < margin) {
                    leftX = rect.right + 16;
                }
                tooltip.style.left = `${Math.max(margin, leftX)}px`;
                tooltip.style.top = `${Math.max(margin, Math.min(viewportHeight - tooltipRect.height - margin, rect.top + rect.height / 2 - tooltipRect.height / 2))}px`;
                tooltip.style.transform = 'none';
                break;
            case 'top':
                tooltip.style.left = `${Math.max(margin, Math.min(viewportWidth - tooltipRect.width - margin, rect.left + rect.width / 2 - tooltipRect.width / 2))}px`;
                tooltip.style.top = `${Math.max(margin, rect.top - tooltipRect.height - 16)}px`;
                tooltip.style.transform = 'none';
                break;
            case 'bottom':
                tooltip.style.left = `${Math.max(margin, Math.min(viewportWidth - tooltipRect.width - margin, rect.left + rect.width / 2 - tooltipRect.width / 2))}px`;
                tooltip.style.top = `${Math.min(viewportHeight - tooltipRect.height - margin, rect.bottom + 16)}px`;
                tooltip.style.transform = 'none';
                break;
            default: // center
                tooltip.style.left = '50%';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translate(-50%, -50%)';
        }
    }

    nextStep() {
        if (this.currentStep === this.tutorialSteps.length - 1) {
            this.completeTutorial();
        } else {
            this.showStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    goToStep(stepIndex) {
        this.showStep(stepIndex);
    }

    skipTutorial() {
        if (confirm('Are you sure you want to skip the tutorial? You can always restart it from the settings.')) {
            this.completeTutorial();
        }
    }

    completeTutorial() {
        this.markTutorialComplete();
        this.hideTutorial();
        console.log('✅ Tutorial completed for user:', userDB.currentUser?.username);
    }

    hideTutorial() {
        // Remove highlight before hiding
        this.removeHighlight();
        
        const container = document.getElementById('tutorial-minimal');
        if (container) {
            container.style.opacity = '0';
            setTimeout(() => {
                container.remove();
                this.isActive = false;
            }, 300);
        }
    }

    // Method to restart tutorial (for settings page)
    restartTutorial() {
        console.log('🔄 Restarting tutorial for user:', userDB.currentUser?.username);
        
        // Clear user-specific tutorial completion
        userDB.clearUserData(this.tutorialKey);
        
        // Hide current tutorial if active
        if (this.isActive) {
            this.hideTutorial();
        }
        
        // Reset tutorial state
        this.currentStep = 0;
        this.isActive = false;
        
        // Start tutorial fresh
        setTimeout(() => {
            this.showTutorial();
        }, 500);
    }

    // Method to reset tutorial (for testing)
    resetTutorial() {
        userDB.clearUserData(this.tutorialKey);
        if (this.isActive) {
            this.hideTutorial();
        }
        setTimeout(() => {
            this.showTutorial();
        }, 100);
    }
}

// Initialize tutorial when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialSystem = new TutorialSystem();
    
    // Add keyboard shortcut for testing (Ctrl+Shift+T)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (window.tutorialSystem) {
                window.tutorialSystem.resetTutorial();
            }
        }
    });
});
