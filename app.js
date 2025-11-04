// Navigation for glass-action-btn buttons
document.addEventListener('DOMContentLoaded', function() {
	const navMap = [
		{ btn: 'btn-projects', section: 'projects' },
		{ btn: 'btn-skills', section: 'skills' },
		{ btn: 'btn-experience', section: 'experience' },
		{ btn: 'btn-contact', section: 'contact' }
	];
	navMap.forEach(({ btn, section }) => {
		const button = document.getElementById(btn);
		const target = document.getElementById(section);
		if (button && target) {
			button.addEventListener('click', () => {
				target.scrollIntoView({ behavior: 'smooth' });
			});
			// Optional: Add hover effect for pointer
			button.style.cursor = 'pointer';
		}
	});
});
// CONTACT SECTION LOGIC (EmailJS)
document.addEventListener('DOMContentLoaded', function() {
	// Configure your EmailJS keys
	const EMAILJS_PUBLIC_KEY = "lotoLHOxxhuQ_7JeQ";
	const EMAILJS_SERVICE_ID = "service_1";
	const EMAILJS_TEMPLATE_ID = "template_qzbjxdq";

	// Initialize EmailJS if the SDK is loaded and a real public key is provided
	if (window.emailjs && EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.startsWith("YOUR_")) {
		emailjs.init(EMAILJS_PUBLIC_KEY);
	}

	const contactForm = document.getElementById("contactForm");
	if (contactForm) {
		contactForm.addEventListener("submit", function(e) {
			e.preventDefault();
			const name = document.getElementById("name").value.trim();
			const email = document.getElementById("email").value.trim();
			const message = document.getElementById("message").value.trim();
			const statusEl = document.getElementById("formStatus");
			const submitBtn = document.getElementById("scramble-btn");

			function setStatus(text, isError = false) {
				if (!statusEl) return;
				statusEl.textContent = text;
				if (isError) {
					statusEl.classList.add("error");
				} else {
					statusEl.classList.remove("error");
				}
			}

			// Basic validation
			if (!name || !email || !message) {
				setStatus("Please fill in all fields.", true);
				return;
			}
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				setStatus("Please enter a valid email address.", true);
				return;
			}

			if (!window.emailjs) {
				setStatus("Email service not loaded. Check your internet connection.", true);
				return;
			}
			if (
				EMAILJS_PUBLIC_KEY.startsWith("YOUR_") ||
				EMAILJS_SERVICE_ID.startsWith("YOUR_") ||
				EMAILJS_TEMPLATE_ID.startsWith("YOUR_")
			) {
				setStatus("Email service not configured yet. Add your EmailJS keys in app.js.", true);
				return;
			}

			submitBtn.disabled = true;
			submitBtn.textContent = "Sending…";
			setStatus("Sending your message…");

			emailjs
				.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
					name: name,
					email: email,
					message: message
				})
				.then(function() {
					setStatus("Thanks! Your message has been sent.");
					contactForm.reset();
				})
				.catch(function(err) {
				
					console.error("EmailJS Error:", err);
					try {
					
						const detail = err && (err.text || err.statusText || err.message);
						setStatus("Couldn't send your message. " + (detail ? detail : "Please try again."), true);
					} catch (e) {
						setStatus("Couldn't send your message. Please try again.", true);
					}
				})
				.finally(function() {
					submitBtn.disabled = false;
					submitBtn.textContent = "SEND MESSAGE";
				});
		});
  
						const scrambleTarget = document.getElementById("contact-text");
						if (scrambleTarget) {
							const original = "CONTACT ME.";
							const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
							let frame = 0;
							let direction = 1; 
							let isPaused = false;
							function scramble() {
								let output = "";
								let scrambling = false;
								for (let i = 0; i < original.length; i++) {
									if (direction === 1 && frame < i) {
										output += chars[Math.floor(Math.random() * chars.length)];
										scrambling = true;
									} else if (direction === -1 && frame > original.length - i - 1) {
										output += chars[Math.floor(Math.random() * chars.length)];
										scrambling = true;
									} else {
										output += original[i];
									}
								}
								// Always show original text when paused
								if (isPaused) {
									scrambleTarget.childNodes[0].nodeValue = original;
								} else {
									scrambleTarget.childNodes[0].nodeValue = output;
								}
								if (direction === 1) {
									frame++;
									if (frame > original.length + 6) {
										direction = -1;
										frame = 0;
										isPaused = true;
										setTimeout(() => {
											isPaused = false;
											scramble();
										}, 900);
										return;
									}
								} else {
									frame++;
									if (frame > original.length + 6) {
										direction = 1;
										frame = 0;
										isPaused = true;
										setTimeout(() => {
											isPaused = false;
											scramble();
										}, 900);
										return;
									}
								}
								setTimeout(scramble, 50);
							}
							scramble();
						}
    // GSAP Scramble Effect for Button (on hover)
    const btn = document.getElementById("scramble-btn");
    if (btn) {
      btn.addEventListener("mouseenter", () => {
        if (!gsap.isTweening(btn)) {
          gsap.to(btn, {
            duration: 1.2,
            scrambleText: {
              text: "SEND MESSAGE",
              chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
              speed: 1.5
            }
          });
        }
      });
    }
  }
});
// Interactive SVG string animation for #string inside glass container
document.addEventListener('DOMContentLoaded', function() {
	const stringPath = document.querySelector('#string path');
	if (!stringPath) return;
	const initialPath = 'M 0 100 Q 500 100 1000 100';
	const stringDiv = document.getElementById('string');
	const danceLetters = document.querySelectorAll('.dance-letter');
	const dancingTextDiv = document.getElementById('dancing-text');
	
	// Function to make the entire text arc/bend like the guitar string
	function animateLettersOnExactCurve(mouseX, mouseY) {
		const textRect = dancingTextDiv.getBoundingClientRect();
		const textWidth = textRect.width;
		
		// Calculate the curve intensity based on mouse position
		const curveIntensity = (mouseY - 100) * 0.8; // How much the curve bends
		const curveCenter = mouseX / 1000; // Where the curve peaks (0 to 1)
		
		danceLetters.forEach((letter, index) => {
			if (letter.textContent.trim() === '') return; // Skip spaces
			
			// Calculate the letter's relative position along the text (0 to 1)
			const letterRect = letter.getBoundingClientRect();
			const letterCenter = letterRect.left + letterRect.width / 2 - textRect.left;
			const t = letterCenter / textWidth; // Parameter t from 0 to 1
			
			// Create an arc - calculate how far this letter is from the curve center
			const distanceFromCenter = Math.abs(t - curveCenter);
			
			// Create a parabolic arc shape - letters closer to center curve more
			const arcFactor = 1 - Math.pow(distanceFromCenter * 2, 2); // Parabolic shape
			const arcHeight = curveIntensity * Math.max(0, arcFactor);
			
			// Calculate the slope at this point for rotation
			const slope = curveIntensity * 4 * (curveCenter - t); // Derivative of parabola
			const rotation = Math.atan(slope) * (180 / Math.PI) * 0.5; // Convert to degrees
			
			// Apply the arc transformation
			gsap.to(letter, {
				y: -arcHeight,
				rotation: rotation,
				duration: 0.08,
				ease: 'power2.out'
			});
		});
	}
	
	// Function to reset letters to normal position
	function resetLetters() {
		danceLetters.forEach((letter) => {
			gsap.to(letter, {
				y: 0,
				rotation: 0,
				duration: 1,
				ease: 'elastic.out(1, 0.2)'
			});
		});
	}
	
	stringDiv.addEventListener('mousemove', (e) => {
		const svg = stringDiv.querySelector('svg');
		const rect = svg.getBoundingClientRect();
		// map mouse pos into SVG space (0–1000 for x, 0–200 for y)
		const x = ((e.clientX - rect.left) / rect.width) * 1000;
		const y = ((e.clientY - rect.top) / rect.height) * 200;
		const path = `M 0 100 Q ${x} ${y} 1000 100`;
		
		gsap.to(stringPath, {
			attr: { d: path },
			duration: 0.1,
			ease: 'power3.out'
		});
		
		// Make letters follow the exact curved path
		animateLettersOnExactCurve(x, y);
	});
	
	stringDiv.addEventListener('mouseleave', () => {
		gsap.to(stringPath, {
			attr: { d: initialPath },
			duration: 1,
			ease: 'elastic.out(1, 0.2)'
		});
		
		// Reset letters with same elastic bounce as string
		resetLetters();
	});
});
// Image ring animation logic for .image-container
document.addEventListener('DOMContentLoaded', function() {
	const imageContainer = document.getElementById('imageContainer');
	if (!imageContainer) return;

	// IntersectionObserver to trigger scroll animation
	const observer = new window.IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				imageContainer.classList.add('scroll-visible');
			} else {
				imageContainer.classList.remove('scroll-visible');
			}
		});
	}, { threshold: 0.3 });
	observer.observe(imageContainer);

	// Hover effect for outer rings
	imageContainer.addEventListener('mouseenter', () => {
		const outerRings = imageContainer.querySelector('.outer-rings');
		if (outerRings) outerRings.style.opacity = '1';
	});
	imageContainer.addEventListener('mouseleave', () => {
		const outerRings = imageContainer.querySelector('.outer-rings');
		if (outerRings) outerRings.style.opacity = '';
	});
});
// GSAP animated text effect for the glass container
document.addEventListener('DOMContentLoaded', function() {
	const textElement = document.getElementById("animatedText");
	if (textElement) {
		// Get the original HTML to preserve the highlight-text span
		const originalHTML = textElement.innerHTML;
		
		// Split text into words while preserving HTML structure
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = originalHTML;
		
		// Process text nodes and wrap individual words
		function wrapWords(node) {
			if (node.nodeType === Node.TEXT_NODE) {
				const words = node.textContent.trim().split(/\s+/);
				if (words.length > 1 || (words.length === 1 && words[0] !== '')) {
					const fragment = document.createDocumentFragment();
					words.forEach((word, index) => {
						if (word) {
							const span = document.createElement('span');
							span.textContent = word + ' ';
							fragment.appendChild(span);
						}
					});
					node.parentNode.replaceChild(fragment, node);
				}
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				// For element nodes, process their children
				const children = Array.from(node.childNodes);
				children.forEach(child => wrapWords(child));
			}
		}
		
		wrapWords(tempDiv);
		textElement.innerHTML = tempDiv.innerHTML;
		
		// Select all spans for animation
		const spans = textElement.querySelectorAll("span");
		
		// First scatter them randomly along X-axis
		gsap.set(spans, {
			x: () => gsap.utils.random(-800, 800), // spread horizontally
			opacity: 0
		});
		
		// Animate them into correct alignment
		gsap.to(spans, {
			x: 0,
			opacity: 1,
			duration: 1.2,
			stagger: 0.15, // delay per word
			ease: "power3.out",
			onComplete: function() {
				// After the main animation completes, setup letter animation for highlight text
				setupHighlightTextAnimation();
			}
		});
	}
});

// Function to setup 3D cube rotation animation - Fixed width to prevent layout shifts
function setupHighlightTextAnimation() {
	const highlightText = document.querySelector('.highlight-text');
	if (highlightText) {
		setTimeout(() => {
			const phrases = [
				'"Choreographing interfaces into life."',
				'"Creating digital experiences."      ',
				'"Building interactive animations."   '
			];
			
			let currentIndex = 0;
			let isAnimating = false;
			
			// Find the longest phrase to set consistent width
			const maxLength = Math.max(...phrases.map(p => p.length));
			
			// Pad all phrases to the same length with trailing spaces
			const paddedPhrases = phrases.map(phrase => {
				return phrase.padEnd(maxLength, ' ');
			});
			
			// Create the 3D container with fixed width
			const container = document.createElement('div');
			container.className = 'text-3d-container';
			
			// Set fixed width based on the longest phrase
			const charWidth = 0.7; // em per character
			const spaceWidth = 0.4; // em per space
			const totalWidth = maxLength * charWidth; // Approximate width in em
			container.style.width = totalWidth + 'em';
			container.style.minWidth = totalWidth + 'em';
			container.style.maxWidth = totalWidth + 'em';
			
			// Function to create cubes for current phrase (using padded phrase)
			function createCubesForPhrase(phrase) {
				container.innerHTML = '';
				const cubes = [];
				
				for (let i = 0; i < phrase.length; i++) {
					const char = phrase[i];
					const charCube = document.createElement('div');
					charCube.className = `char-cube ${char === ' ' ? 'space' : 'letter'}`;
					
					const cubeInner = document.createElement('div');
					cubeInner.className = 'cube-inner';
					
					// Create 4 faces for the cube
					const faces = ['front', 'top', 'back', 'bottom'];
					faces.forEach(faceClass => {
						const face = document.createElement('div');
						face.className = `cube-face ${faceClass}`;
						face.textContent = char === ' ' ? '\u00A0' : char;
						cubeInner.appendChild(face);
					});
					
					charCube.appendChild(cubeInner);
					container.appendChild(charCube);
					cubes.push({ element: charCube, inner: cubeInner });
				}
				
				return cubes;
			}
			
			// Initialize with first padded phrase
			let cubes = createCubesForPhrase(paddedPhrases[currentIndex]);
			
			// Replace the text content with the 3D container
			highlightText.innerHTML = '';
			highlightText.appendChild(container);
			
			// Animation function
			function rotateTo3D() {
				if (isAnimating) return;
				
				isAnimating = true;
				const nextIndex = (currentIndex + 1) % paddedPhrases.length;
				
				// Start rotation for each character with stagger
				cubes.forEach((cube, index) => {
					setTimeout(() => {
						if (cube.inner) {
							cube.inner.classList.add('rotating');
						}
					}, index * 25);
				});
				
				// After rotation starts, update the faces with new text
				setTimeout(() => {
					const newPhrase = paddedPhrases[nextIndex];
					
					// Update each cube's faces with new characters
					cubes.forEach((cube, index) => {
						const newChar = newPhrase[index] || ' ';
						const faces = cube.inner.querySelectorAll('.cube-face');
						
						faces.forEach(face => {
							face.textContent = newChar === ' ' ? '\u00A0' : newChar;
						});
						
						// Update cube class for spacing
						cube.element.className = `char-cube ${newChar === ' ' ? 'space' : 'letter'}`;
					});
					
					currentIndex = nextIndex;
					
					// Remove rotation classes after animation
					setTimeout(() => {
						cubes.forEach(cube => {
							if (cube.inner) {
								cube.inner.classList.remove('rotating');
							}
						});
						isAnimating = false;
					}, 100);
				}, 400); // Update faces mid-rotation
			}
			
			// Start the animation loop
			setInterval(rotateTo3D, 4000);
			
		}, 3000);
	}
}
// Custom typewriter animation for glass-title
const typewriterText = document.getElementById('typewriter-text');
const name1 = 'TANISHKA SHARMA';
const name2 = 'TANISHKA SHARMA';


let state = 0; // 0: backspacing, 1: typing SHARMA, 2: backspacing SHARMA, 3: typing TANISHKA
let index = name1.length;

function animateTypewriter() {
	if (state === 0) {
			// Backspace from end of TANISHKA to nothing
		if (index > 1) {
			index--;
			typewriterText.textContent = name1.substring(0, index);
			setTimeout(animateTypewriter, 80);
		} else {
			state = 1;
			index = 0;
			setTimeout(animateTypewriter, 400);
		}
	} else if (state === 1) {
			// Type SHARMA
		if (index < name2.length) {
			typewriterText.textContent =  name2.substring(0, index + 1);
			index++;
			setTimeout(animateTypewriter, 120);
		} else {
			state = 2;
			setTimeout(animateTypewriter, 1200);
		}
	} else if (state === 2) {
			// Backspace all of 'SHARMA'
		if (index > 0) {
			typewriterText.textContent = name2.substring(0, index - 1);
			index--;
			setTimeout(animateTypewriter, 80);
		} else {
			state = 3;
			index = 1;
			setTimeout(animateTypewriter, 400);
		}
	} else if (state === 3) {
		// Type TANISHKA from 'A'
		if (index <= name1.length) {
			typewriterText.textContent = name1.substring(0, index);
			index++;
			setTimeout(animateTypewriter, 120);
		} else {
			state = 0;
			index = name1.length;
			setTimeout(animateTypewriter, 1200);
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	typewriterText.textContent = name1;
	setTimeout(animateTypewriter, 1200);
});
// Remove scroll-based card animation for project cards
// (No scroll-triggered opacity/transform for .card-row)
// === Floating Bouncing Skills Animation ===
document.addEventListener("DOMContentLoaded", function() {
  const floatArea = document.querySelector(".skills-float-area");
  if (!floatArea) return;
  const floats = Array.from(floatArea.querySelectorAll(".skill-float"));
  const floatData = [];

  floats.forEach((float, index) => {
    // Slower, smoother speeds
    const baseSpeed = Math.random() * 1.5 + 0.8; // 0.8 to 2.3 - much slower!
    const angle = (Math.random() * Math.PI * 2); // Random angle in radians
    const dx = Math.cos(angle) * baseSpeed;
    const dy = Math.sin(angle) * baseSpeed;
    
    const maxX = floatArea.clientWidth - float.offsetWidth;
    const maxY = floatArea.clientHeight - float.offsetHeight;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    float.style.left = `${x}px`;
    float.style.top = `${y}px`;
    
    const data = { 
      float, 
      dx, 
      dy, 
      x, 
      y, 
      baseSpeed,
      isPaused: false,
      // Add slight variation to each icon
      speedVariation: Math.random() * 0.4 + 0.9 // 0.9 to 1.3 multiplier - wider range
    };
    
    float.addEventListener("mouseenter", () => (data.isPaused = true));
    float.addEventListener("mouseleave", () => (data.isPaused = false));
    floatData.push(data);
  });

  function animate() {
    const areaWidth = floatArea.clientWidth;
    const areaHeight = floatArea.clientHeight;
    
    floatData.forEach((data) => {
      if (data.isPaused) return;
      
      // Apply speed variation for more independent movement
      const currentSpeedX = data.dx * data.speedVariation;
      const currentSpeedY = data.dy * data.speedVariation;
      
      data.x += currentSpeedX;
      data.y += currentSpeedY;
      
      // Bounce off walls with slight randomization
      if (data.x <= 0 || data.x + data.float.offsetWidth >= areaWidth) {
        data.dx *= -1;
        data.x = Math.max(0, Math.min(data.x, areaWidth - data.float.offsetWidth));
        // Add slight randomization on bounce
        data.speedVariation = Math.random() * 0.4 + 0.9;
      }
      if (data.y <= 0 || data.y + data.float.offsetHeight >= areaHeight) {
        data.dy *= -1;
        data.y = Math.max(0, Math.min(data.y, areaHeight - data.float.offsetHeight));
        // Add slight randomization on bounce
        data.speedVariation = Math.random() * 0.4 + 0.9;
      }
      
      data.float.style.left = `${data.x}px`;
      data.float.style.top = `${data.y}px`;
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
});
// Experience card hover and settle animation

document.addEventListener('DOMContentLoaded', function() {
  const expCards = document.querySelectorAll('.exp-card');
  expCards.forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.classList.add('settle');
      card.style.width = '240px';
      card.style.height = '420px';
      setTimeout(() => {
        card.classList.remove('settle');
      }, 500); // match animation duration
    });
    card.addEventListener('mouseenter', () => {
      card.style.width = '520px';
      card.style.height = '300px';
    });
  });
});

// Function to copy email to clipboard and show notification
function copyEmail() {
	const email = 'tanishka047@gmail.com';
	
	// Copy to clipboard using the modern Clipboard API
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(email).then(() => {
			showCopyNotification();
		}).catch(() => {
			// Fallback for older browsers
			fallbackCopyTextToClipboard(email);
		});
	} else {
		// Fallback for older browsers or non-secure contexts
		fallbackCopyTextToClipboard(email);
	}
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text) {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed';
	textArea.style.left = '-999999px';
	textArea.style.top = '-999999px';
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	
	try {
		document.execCommand('copy');
		showCopyNotification();
	} catch (err) {
		console.log('Unable to copy email');
	}
	
	document.body.removeChild(textArea);
}

// Show copy notification popup
function showCopyNotification() {
	// Remove any existing notification
	const existingNotification = document.querySelector('.copy-notification');
	if (existingNotification) {
		existingNotification.remove();
	}
	
	// Create notification element
	const notification = document.createElement('div');
	notification.className = 'copy-notification';
	notification.textContent = 'Email copied to clipboard!';
	
	// Add to body
	document.body.appendChild(notification);
	
	// Show notification
	setTimeout(() => {
		notification.classList.add('show');
	}, 10);
	
	// Hide and remove notification after 2 seconds
	setTimeout(() => {
		notification.classList.remove('show');
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}, 2000);
}
