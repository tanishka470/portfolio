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
// CONTACT SECTION LOGIC
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
      alert(`Message Sent!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    });
    // GSAP Scramble Effect for Contact Me (always run after plugin registration)
					// Custom scramble text animation for #contact-text
						const scrambleTarget = document.getElementById("contact-text");
						if (scrambleTarget) {
							const original = "CONTACT ME.";
							const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
							let frame = 0;
							let direction = 1; // 1 = scramble in, -1 = scramble out
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
	});
	stringDiv.addEventListener('mouseleave', () => {
		gsap.to(stringPath, {
			attr: { d: initialPath },
			duration: 1,
			ease: 'elastic.out(1, 0.2)'
		});
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
		// Split text into words
		const words = textElement.innerText.split(" ");
		textElement.innerHTML = words.map(word => `<span>${word} </span>`).join("");
		// Select all spans
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
			ease: "power3.out"
		});
	}
});
// Custom typewriter animation for glass-title
const typewriterText = document.getElementById('typewriter-text');
const name1 = 'TANISHKA';
const name2 = 'SHARMA';
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
    // Much faster speeds and directions
    const baseSpeed = Math.random() * 4 + 2.5; // 2.5 to 6.5 - much faster!
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
