document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    let hasMouseMoved = false;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        if (!hasMouseMoved) {
            hasMouseMoved = true;
            cursor.style.opacity = '1';
        }
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Add active state on clickable elements
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
    
    // Binary stream effect
    const binaryContainer = document.getElementById('binary-container');
    const funMessages = document.querySelectorAll('.message');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressText = document.querySelector('.progress-text');
    
    // Create binary stream
    function createBinaryStream() {
        const columns = Math.floor(window.innerWidth / 20);
        const rows = Math.floor(window.innerHeight / 20);
        
        for (let i = 0; i < columns; i++) {
            const binary = document.createElement('div');
            binary.className = 'binary';
            binary.style.left = `${i * 20}px`;
            binary.style.top = `${Math.random() * window.innerHeight}px`;
            binary.textContent = generateBinaryString();
            binaryContainer.appendChild(binary);
            
            // Animate binary
            animateBinary(binary);
        }
    }
    
    // Generate random binary string
    function generateBinaryString() {
        const length = Math.floor(Math.random() * 10) + 5;
        return Array(length).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('');
    }
    
    // Animate binary element
    function animateBinary(element) {
        setInterval(() => {
            element.textContent = generateBinaryString();
            element.style.top = `${Math.random() * window.innerHeight}px`;
        }, 2000);
    }
    
    // Animate fun messages
    function animateMessages() {
        let currentIndex = 0;
        let isTransitioning = false;
        
        function showNextMessage() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            // Remove visible class from current message
            const currentMessage = funMessages[currentIndex];
            currentMessage.classList.remove('visible');
            
            // Wait for fade out
            setTimeout(() => {
                // Update index
                currentIndex = (currentIndex + 1) % funMessages.length;
                
                // Show next message
                const nextMessage = funMessages[currentIndex];
                nextMessage.classList.add('visible');
                
                // Reset transition flag after animation
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }, 500);
        }
        
        // Start with first message
        funMessages[0].classList.add('visible');
        
        // Start the cycle
        setInterval(showNextMessage, 3000);
    }
    
    // Simulate progress
    function simulateProgress() {
        let progress = 0;
        const targetProgress = 69;
        let reachedTarget = false;
        
        const interval = setInterval(() => {
            if (!reachedTarget) {
                progress += Math.random() * 4; // Increased speed
                if (progress >= targetProgress) {
                    progress = targetProgress;
                    reachedTarget = true;
                    progressText.textContent = `Loading error: ${Math.floor(progress)}%`;
                }
            } else {
                // Oscillate around 69%
                progress = targetProgress + (Math.random() * 2 - 1);
            }
            
            progressFill.style.width = `${progress}%`;
            if (!reachedTarget) {
                progressPercentage.textContent = Math.floor(progress);
            }
        }, 200); // Faster update interval
    }
    
    // Initialize
    createBinaryStream();
    animateMessages();
    simulateProgress();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        binaryContainer.innerHTML = '';
        createBinaryStream();
    });
}); 