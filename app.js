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
						console.log('nav: attaching', btn, '->', section);
						button.addEventListener('click', (e) => {
							console.log('nav: clicked', btn, 'targetId=', section);
							e.preventDefault && e.preventDefault();

							// Find nearest scrollable ancestor for the target (so we scroll inside containers like .glass-container)
							function findScrollableAncestor(el) {
								let node = el.parentElement;
								while (node && node !== document.documentElement) {
									const style = window.getComputedStyle(node);
									const overflowY = style.overflowY;
									if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
										return node;
									}
									node = node.parentElement;
								}
								return null;
							}

							const TOP_PADDING = 64; // px — adjust if you have a fixed header
							const scrollParent = findScrollableAncestor(target);
							if (scrollParent) {
								// compute offsetTop relative to the scrollParent
								const parentRect = scrollParent.getBoundingClientRect();
								const targetRect = target.getBoundingClientRect();
								const offset = (targetRect.top - parentRect.top) + scrollParent.scrollTop - TOP_PADDING;
								scrollParent.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
							} else {
								const rect = target.getBoundingClientRect();
								const targetY = window.pageYOffset + rect.top - TOP_PADDING;
								window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
							}
						});
						// Optional: Add hover effect for pointer
						button.style.cursor = 'pointer';
					} else {
						console.warn('nav: missing element', btn, 'or target', section);
					}
		});
});
// Delegated handler as a fallback in case direct listeners are blocked
document.addEventListener('click', function(e) {
	const btn = e.target.closest && e.target.closest('.glass-action-btn');
	if (!btn) return;
	try {
		console.log('nav-delegate: clicked', btn.id || btn.className);
		// Map known button ids to section ids
		const map = {
			'btn-projects': 'projects',
			'btn-skills': 'skills',
			'btn-experience': 'experience',
			'btn-contact': 'contact'
		};
		const targetId = map[btn.id] || btn.getAttribute('data-target');
		if (!targetId) {
			console.warn('nav-delegate: no target for', btn.id);
			return;
		}
			const target = document.getElementById(targetId);
			if (!target) {
				console.warn('nav-delegate: target element not found', targetId);
				return;
			}
			// same scroll logic as the primary handler: try to find a scrollable ancestor
			function findScrollableAncestor(el) {
				let node = el.parentElement;
				while (node && node !== document.documentElement) {
					const style = window.getComputedStyle(node);
					const overflowY = style.overflowY;
					if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
						return node;
					}
					node = node.parentElement;
				}
				return null;
			}
			const TOP_PADDING = 64;
			const scrollParent = findScrollableAncestor(target);
			if (scrollParent) {
				const parentRect = scrollParent.getBoundingClientRect();
				const targetRect = target.getBoundingClientRect();
				const offset = (targetRect.top - parentRect.top) + scrollParent.scrollTop - TOP_PADDING;
				scrollParent.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
			} else {
				const rect = target.getBoundingClientRect();
				const targetY = window.pageYOffset + rect.top - TOP_PADDING;
				window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
			}
	} catch (err) {
		console.error('nav-delegate error', err);
	}
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
// Replace hover morph with an interactive badge modal + confetti
document.addEventListener('DOMContentLoaded', function() {
	// Ensure no hover morph remains; keep cards stable
	document.querySelectorAll('.exp-card').forEach(c => {
		c.style.width = c.style.width || '';
		c.style.height = c.style.height || '';
	});

	const modal = document.getElementById('badgeModal');
	if (!modal) return; // if markup not present, exit

	const confettiRoot = document.getElementById('confetti-root');
	const modalTitle = modal.querySelector('.modal-title');
	const modalRole = modal.querySelector('.modal-role');
	const modalDesc = modal.querySelector('.modal-desc');
	const modalBadgePreview = modal.querySelector('.modal-badge-preview');
	const copyBtn = modal.querySelector('.modal-copy');
	const closeBtns = modal.querySelectorAll('.modal-close');

	function openModalFromBadge(badgeEl) {
		const card = badgeEl.closest('.exp-card');
		const title = (card && card.querySelector('h3')) ? card.querySelector('h3').innerText.trim() : 'Details';
		const role = (card && card.querySelector('.role')) ? card.querySelector('.role').innerText.trim() : '';
		const desc = (card && card.querySelector('.desc')) ? card.querySelector('.desc').innerText.trim() : '';

		modalTitle.textContent = title;
		modalRole.textContent = role;
		modalDesc.textContent = desc;

		// style the small preview badge background by cloning computed styles
		modalBadgePreview.style.background = window.getComputedStyle(badgeEl).backgroundImage || 'linear-gradient(90deg, rgba(0,255,136,0.12), rgba(0,255,136,0.22))';
		modalBadgePreview.textContent = badgeEl.textContent.trim();

			modal.setAttribute('aria-hidden', 'false');
			document.body.classList.add('modal-open');
			badgeEl.classList.add('active');

			// GSAP-powered entrance: pop, neon-halo pulse and sparkles
			const modalBox = modal.querySelector('.badge-modal__box');
			const halo = document.createElement('div');
			halo.className = 'badge-modal__halo';
			modal.insertBefore(halo, modalBox);

			// ensure starting values
			gsap.set(modalBox, { scale: 0.72, rotation: -6, autoAlpha: 0 });
			gsap.set(halo, { scale: 0.9, autoAlpha: 0 });
			gsap.set(modalBadgePreview, { backgroundSize: '100% 0%' });

			const tl = gsap.timeline();
			tl.to(modalBox, { duration: 0.6, scale: 1.02, rotation: 4, autoAlpha: 1, ease: 'back.out(1.6)' })
				.to(modalBox, { duration: 0.15, rotation: 0, scale: 1, ease: 'power2.out' }, '>-0.02')
				.to(halo, { duration: 0.7, autoAlpha: 1, scale: 1.06, ease: 'power2.out' }, '<')
				.to(modalBadgePreview, { duration: 0.56, backgroundSize: '100% 100%', ease: 'power2.out' }, '<0.08');

			// sparkles: spawn a few small elements that scale/float out
			const sparkleCount = 8;
			for (let i = 0; i < sparkleCount; i++) {
				const sp = document.createElement('div');
				sp.className = 'sparkle';
				const rect = modalBox.getBoundingClientRect();
				// position near the title area
				const sx = rect.left + rect.width * (0.3 + Math.random() * 0.4);
				const sy = rect.top + rect.height * (0.12 + Math.random() * 0.18);
				sp.style.left = sx + 'px';
				sp.style.top = sy + 'px';
				// random color tint
				sp.style.background = ['#9fffd8','#d6fff0','#b9ffd0','#7fffc1'][Math.floor(Math.random()*4)];
				document.getElementById('confetti-root').appendChild(sp);

				const dx = (Math.random() - 0.5) * 200;
				const dy = - (Math.random() * 160 + 40);
				const rot = (Math.random() - 0.5) * 360;
				gsap.timeline({ onComplete: () => sp.remove() })
					.to(sp, { duration: 0.02, autoAlpha: 1, scale: 0.9 })
					.to(sp, { duration: 0.9 + Math.random()*0.6, x: dx, y: dy, rotation: rot, scale: 1.6, autoAlpha: 0, ease: 'power2.out' });
			}

			// Trigger a short confetti burst around the modal center (keeps previous confetti behavior)
			const rect = modal.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 3;
			burstConfetti(cx, cy, 24);
	}

	function closeModal() {
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		// remove active from any badge on page
		document.querySelectorAll('.exp-badge.active').forEach(b => b.classList.remove('active'));
	}

	// Copy details to clipboard
	copyBtn.addEventListener('click', function() {
		const text = modalTitle.textContent + '\n' + modalRole.textContent + '\n' + modalDesc.textContent;
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(text).then(() => showModalToast('Copied!'));
		} else {
			// fallback
			const ta = document.createElement('textarea');
			ta.value = text;
			ta.style.position = 'fixed'; ta.style.left = '-9999px';
			document.body.appendChild(ta); ta.select();
			try { document.execCommand('copy'); showModalToast('Copied!'); } catch(e){ showModalToast('Copy failed'); }
			document.body.removeChild(ta);
		}
	});

	// Close buttons and backdrop close
	closeBtns.forEach(b => b.addEventListener('click', closeModal));
	modal.querySelector('[data-action="close"]').addEventListener('click', closeModal);
	document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

	// Attach badge click handlers
	document.querySelectorAll('.exp-badge').forEach(b => {
		b.style.cursor = 'pointer';
		b.addEventListener('click', (e) => {
			e.stopPropagation();
			openModalFromBadge(b);
		});
	});

	// small toast shown near bottom-right
	function showModalToast(text) {
		const toast = document.createElement('div');
		toast.className = 'modal-toast';
		toast.textContent = text;
		document.body.appendChild(toast);
		setTimeout(() => toast.style.opacity = '1', 20);
		setTimeout(() => { toast.style.opacity = '0'; setTimeout(()=> toast.remove(), 350); }, 1600);
	}

	// Confetti implementation: simple DOM pieces animated with requestAnimationFrame
	function burstConfetti(x, y, count) {
		const colors = ['#00ff88','#7cf2b1','#7cffa6','#d9ffef','#8ef3c1','#6ee1a6'];
		for (let i=0;i<count;i++) {
			const el = document.createElement('div');
			el.className = 'confetti-piece';
			el.style.background = colors[Math.floor(Math.random()*colors.length)];
			el.style.left = (x + (Math.random()-0.5)*220) + 'px';
			el.style.top = (y + (Math.random()-0.5)*120) + 'px';
			el.style.opacity = '1';
			el.style.transform = `translate3d(0,0,0) rotate(${Math.random()*360}deg)`;
			document.getElementById('confetti-root').appendChild(el);

			// animate via CSS-like frame loop
			const vx = (Math.random()-0.5) * 6;
			const vy = - (Math.random()*6 + 2);
			const vr = (Math.random()-0.5)*20;
			let px = parseFloat(el.style.left);
			let py = parseFloat(el.style.top);
			let life = 0;

			function frame() {
				life += 1;
				px += vx;
				py += vy + life*0.18; // gravity
				el.style.left = px + 'px';
				el.style.top = py + 'px';
				el.style.transform = `rotate(${life*vr}deg)`;
				el.style.opacity = String(Math.max(0, 1 - life/60));
				if (life < 70) requestAnimationFrame(frame); else el.remove();
			}
			requestAnimationFrame(frame);
		}
	}

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
