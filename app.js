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
		gsap.to("#contact-text", {
			duration: 2,
			scrambleText: {
				text: "CONTACT ME.",
			},
			repeat: -1,
			yoyo: true,
			repeatDelay: 1
		});
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

  floats.forEach((float) => {
    const speed = Math.random() * 1.5 + 1.8; // even faster: min 1.8, max 3.3
    const dx = (Math.random() < 0.5 ? -1 : 1) * speed;
    const dy = (Math.random() < 0.5 ? -1 : 1) * speed;
    const maxX = floatArea.clientWidth - float.offsetWidth;
    const maxY = floatArea.clientHeight - float.offsetHeight;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    float.style.left = `${x}px`;
    float.style.top = `${y}px`;
    const data = { float, dx, dy, x, y, speed, isPaused: false };
    float.addEventListener("mouseenter", () => (data.isPaused = true));
    float.addEventListener("mouseleave", () => (data.isPaused = false));
    floatData.push(data);
  });

  function animate() {
    const areaWidth = floatArea.clientWidth;
    const areaHeight = floatArea.clientHeight;
    floatData.forEach((data) => {
      if (data.isPaused) return;
      data.x += data.dx;
      data.y += data.dy;
      if (data.x <= 0 || data.x + data.float.offsetWidth >= areaWidth) {
        data.dx *= -1;
        data.x = Math.max(0, Math.min(data.x, areaWidth - data.float.offsetWidth));
      }
      if (data.y <= 0 || data.y + data.float.offsetHeight >= areaHeight) {
        data.dy *= -1;
        data.y = Math.max(0, Math.min(data.y, areaHeight - data.float.offsetHeight));
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
