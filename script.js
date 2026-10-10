/* ===================================================================
   BIRTHDAY CELEBRATION SCRIPT
   Features: Audio Controller, Pure Canvas Confetti, Interactive Cake,
   Polaroid Lightbox, Sticky Wish Board & LocalStorage State
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------
     1. AUDIO PLAYER & OPENING MODAL
     ----------------------------------------------------------------- */
  const bgMusic = document.getElementById('bgMusic');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const muteBtn = document.getElementById('muteBtn');
  const muteIcon = document.getElementById('muteIcon');
  const musicDisc = document.getElementById('musicDisc');
  const musicDiscWrap = document.getElementById('musicDiscWrap');
  const musicBar = document.getElementById('musicBar');
  const progressFill = document.getElementById('progressFill');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const introModal = document.getElementById('introModal');
  const btnOpenGift = document.getElementById('btnOpenGift');

  let isPlaying = false;

  // Function to start music safely
  function playAudio() {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicDisc.classList.add('playing');
      musicBar.classList.add('is-playing');
      playIcon.textContent = '⏸️';
    }).catch(err => {
      console.warn("Audio play prevented or file issue:", err);
      isPlaying = false;
      playIcon.textContent = '▶️';
    });
  }

  function pauseAudio() {
    bgMusic.pause();
    isPlaying = false;
    musicDisc.classList.remove('playing');
    musicBar.classList.remove('is-playing');
    playIcon.textContent = '▶️';
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (musicDiscWrap) musicDiscWrap.addEventListener('click', togglePlayPause);

  // Mute / Unmute
  if (muteBtn && bgMusic) {
    muteBtn.addEventListener('click', () => {
      bgMusic.muted = !bgMusic.muted;
      if (muteIcon) muteIcon.textContent = bgMusic.muted ? '🔇' : '🔊';
    });
  }

  // Progress Bar
  if (bgMusic && progressFill) {
    bgMusic.addEventListener('timeupdate', () => {
      if (bgMusic.duration) {
        const percentage = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressFill.style.width = `${percentage}%`;
      }
    });
  }

  if (progressBarContainer && bgMusic) {
    progressBarContainer.addEventListener('click', (e) => {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      if (bgMusic.duration) {
        bgMusic.currentTime = clickPosition * bgMusic.duration;
      }
    });
  }

  // Open Intro Modal & Trigger Celebration
  if (btnOpenGift && introModal) {
    btnOpenGift.addEventListener('click', () => {
      introModal.classList.add('hidden');
      playAudio();
      burstConfetti(120);
      setTimeout(() => {
        burstConfetti(80);
      }, 600);
    });
  }


  /* -----------------------------------------------------------------
     2. RECIPIENT NAME CUSTOMIZATION (LOCALSTORAGE)
     ----------------------------------------------------------------- */
  const recipientNameEl = document.getElementById('recipientName');
  const btnEditName = document.getElementById('btnEditName');

  const savedName = localStorage.getItem('birthdayRecipientName');
  if (savedName && recipientNameEl) {
    recipientNameEl.textContent = savedName;
  }

  function editRecipientName() {
    if (!recipientNameEl) return;
    const currentName = recipientNameEl.textContent.trim();
    const newName = prompt('Masukkan nama yang berulang tahun:', currentName);
    if (newName && newName.trim() !== '') {
      recipientNameEl.textContent = newName.trim();
      localStorage.setItem('birthdayRecipientName', newName.trim());
      burstConfetti(50);
    }
  }

  if (btnEditName) {
    btnEditName.addEventListener('click', editRecipientName);
  }
  if (recipientNameEl) {
    recipientNameEl.addEventListener('click', editRecipientName);
  }


  /* -----------------------------------------------------------------
     3. INTERACTIVE BIRTHDAY CAKE (TIUP LILIN)
     ----------------------------------------------------------------- */
  const candleWrapper = document.getElementById('candleWrapper');
  const smoke = document.getElementById('smoke');
  const btnBlowCandle = document.getElementById('btnBlowCandle');
  const btnRelightCandle = document.getElementById('btnRelightCandle');
  const wishStatusText = document.getElementById('wishStatusText');
  const wishBanner = document.getElementById('wishBanner');

  function extinguishCandle() {
    if (candleWrapper) {
      candleWrapper.classList.add('blown-out');
    }
    if (smoke) {
      smoke.classList.remove('active');
      void smoke.offsetWidth; // Force reflow to replay smoke animation cleanly
      smoke.classList.add('active');
    }

    // Wish Banner state
    if (wishBanner) wishBanner.classList.add('blown');
    if (wishStatusText) {
      wishStatusText.textContent = '🎉 Yaaaay! Lilin berhasil ditiup! Semoga semua doamu terkabul! ✨';
    }
    const wishIcon = wishBanner ? wishBanner.querySelector('.wish-icon') : null;
    if (wishIcon) wishIcon.textContent = '✨';

    // Buttons toggle
    if (btnBlowCandle) btnBlowCandle.style.display = 'none';
    if (btnRelightCandle) btnRelightCandle.style.display = 'inline-flex';

    // Confetti explosion
    burstConfetti(150);
    setTimeout(() => burstConfetti(100), 400);
    setTimeout(() => burstConfetti(80), 800);
  }

  function relightCandle() {
    if (candleWrapper) {
      candleWrapper.classList.remove('blown-out');
    }
    if (smoke) smoke.classList.remove('active');

    if (wishBanner) wishBanner.classList.remove('blown');
    if (wishStatusText) {
      wishStatusText.textContent = 'Lilin masih menyala terang... Siap meniup?';
    }
    const wishIcon = wishBanner ? wishBanner.querySelector('.wish-icon') : null;
    if (wishIcon) wishIcon.textContent = '🕯️';

    if (btnRelightCandle) btnRelightCandle.style.display = 'none';
    if (btnBlowCandle) btnBlowCandle.style.display = 'inline-flex';
  }

  if (btnBlowCandle) {
    btnBlowCandle.addEventListener('click', extinguishCandle);
  }

  if (btnRelightCandle) {
    btnRelightCandle.addEventListener('click', relightCandle);
  }

  // Allow clicking/tapping directly on the candle to blow out or relight
  if (candleWrapper) {
    candleWrapper.addEventListener('click', () => {
      if (candleWrapper.classList.contains('blown-out')) {
        relightCandle();
      } else {
        extinguishCandle();
      }
    });
  }


  /* -----------------------------------------------------------------
     4. POLAROID GALLERY, LIKES & LIGHTBOX
     ----------------------------------------------------------------- */
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryItems = [];

  polaroidCards.forEach((card, index) => {
    const src = card.getAttribute('data-src');
    const caption = card.getAttribute('data-caption');
    galleryItems.push({ src, caption });

    // Click photo frame to open Lightbox
    const photoFrame = card.querySelector('.photo-frame');
    if (photoFrame) {
      photoFrame.addEventListener('click', (e) => {
        openLightbox(index);
      });
    }

    // Like Button
    const likeBtn = card.querySelector('.like-btn');
    const likeCountSpan = card.querySelector('.like-count');
    const storageKey = `photo_like_${index}`;
    let isLiked = localStorage.getItem(storageKey) === 'true';
    let currentCount = likeCountSpan ? parseInt(likeCountSpan.textContent, 10) || 0 : 0;

    if (likeBtn && isLiked) {
      likeBtn.classList.add('liked');
      const heartIcon = likeBtn.querySelector('.heart-icon');
      if (heartIcon) heartIcon.textContent = '❤️';
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isLiked = !isLiked;
        if (isLiked) {
          currentCount++;
          likeBtn.classList.add('liked');
          const heartIcon = likeBtn.querySelector('.heart-icon');
          if (heartIcon) heartIcon.textContent = '❤️';
          burstConfetti(25);
        } else {
          currentCount = Math.max(0, currentCount - 1);
          likeBtn.classList.remove('liked');
          const heartIcon = likeBtn.querySelector('.heart-icon');
          if (heartIcon) heartIcon.textContent = '🤍';
        }
        if (likeCountSpan) likeCountSpan.textContent = currentCount;
        localStorage.setItem(storageKey, isLiked.toString());
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryItems[currentGalleryIndex];
    if (item && lightboxImg && lightboxCaption) {
      lightboxImg.src = item.src;
      lightboxCaption.textContent = item.caption;
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      updateLightboxContent();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });


  /* -----------------------------------------------------------------
     5. VIRTUAL GIFT BOX (KADO SPESIAL)
     ----------------------------------------------------------------- */
  const interactiveGiftBox = document.getElementById('interactiveGiftBox');
  const giftPromptText = document.getElementById('giftPromptText');
  const giftSurprise = document.getElementById('giftSurprise');
  const btnClaimCoupon = document.getElementById('btnClaimCoupon');

  function openGiftBox() {
    if (!interactiveGiftBox) return;
    if (!interactiveGiftBox.classList.contains('opened')) {
      interactiveGiftBox.classList.add('opened');
      if (giftPromptText) {
        giftPromptText.innerHTML = '🎉 Horeee! Kado berhasil dibuka! <span style="display:block;font-size:0.85rem;font-weight:normal;color:#b45309;margin-top:4px;">(Klik kotak kado lagi jika ingin menutup / membuka kembali)</span>';
      }
      if (giftSurprise) {
        giftSurprise.classList.add('show');
        setTimeout(() => {
          giftSurprise.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
      burstConfetti(120);
      setTimeout(() => burstConfetti(80), 350);
    } else {
      interactiveGiftBox.classList.remove('opened');
      if (giftPromptText) {
        giftPromptText.textContent = '👆 Ketuk kotak kado kuning di atas untuk membuka!';
      }
      if (giftSurprise) {
        giftSurprise.classList.remove('show');
      }
    }
  }

  if (interactiveGiftBox) {
    interactiveGiftBox.addEventListener('click', openGiftBox);
  }

  if (giftPromptText) {
    giftPromptText.addEventListener('click', openGiftBox);
  }

  if (btnClaimCoupon) {
    btnClaimCoupon.addEventListener('click', () => {
      burstConfetti(100);
      alert('💖 Hadiah & Kupon Spesial Tersimpan! Tunjukkan ini kapan pun kamu mau ya! ✨');
    });
  }


  /* -----------------------------------------------------------------
     6. WISH BOARD (PAPAN HARAPAN & STICKY NOTES)
     ----------------------------------------------------------------- */
  const wishForm = document.getElementById('wishForm');
  const senderInput = document.getElementById('senderInput');
  const messageInput = document.getElementById('messageInput');
  const colorThemeSelect = document.getElementById('colorThemeSelect');
  const charCount = document.getElementById('charCount');
  const pinboardContainer = document.getElementById('pinboardContainer');

  // Character counter
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.textContent = `${messageInput.value.length}/300`;
    });
  }

  const DEFAULT_WISHES = [
    {
      author: 'Restu 💛',
      message: 'Selamat ulang tahun ya! Semoga harimu selalu dipenuhi tawa, dikelilingi cinta, dan dilancarkan segala hal yang kamu impikan!',
      color: 'sticky-yellow',
      date: 'Spesial Hari Ini'
    },
    {
      author: 'Teman Bahagia ✨',
      message: 'Semoga makin berkah usianya, selalu sehat, dan terus memancarkan energi positif untuk orang-orang di sekitarmu!',
      color: 'sticky-honey',
      date: 'Hari Bahagia'
    },
    {
      author: 'Keluarga Tersayang 🌻',
      message: 'Doa terbaik kami selalu menyertaimu di setiap hembusan nafas dan langkah perjuanganmu. Bangga selalu padamu!',
      color: 'sticky-coral',
      date: 'Penuh Doa'
    }
  ];

  function getStoredWishes() {
    const raw = localStorage.getItem('birthday_wishes_list');
    if (!raw) return DEFAULT_WISHES;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WISHES;
    }
  }

  function saveWishes(wishes) {
    localStorage.setItem('birthday_wishes_list', JSON.stringify(wishes));
  }

  function renderWishes() {
    if (!pinboardContainer) return;
    const wishes = getStoredWishes();
    pinboardContainer.innerHTML = '';
    wishes.forEach(item => {
      const note = document.createElement('div');
      note.className = `sticky-note ${item.color}`;
      note.innerHTML = `
        <div class="sticky-pin"></div>
        <p class="sticky-text">${escapeHtml(item.message)}</p>
        <div class="sticky-author">
          <span>~ ${escapeHtml(item.author)}</span>
          <small>${item.date || 'Hari Ini'}</small>
        </div>
      `;
      pinboardContainer.appendChild(note);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = senderInput ? senderInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const color = colorThemeSelect ? colorThemeSelect.value : 'sticky-yellow';

      if (!author || !message) return;

      const newWish = {
        author,
        message,
        color,
        date: 'Baru saja'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      wishForm.reset();
      if (charCount) charCount.textContent = '0/300';
      burstConfetti(70);

      // Scroll to the new note smoothly
      if (pinboardContainer && pinboardContainer.firstElementChild) {
        pinboardContainer.firstElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (pinboardContainer) {
    renderWishes();
  }


  /* -----------------------------------------------------------------
     7. QUICK ACTIONS & BACK TO TOP
     ----------------------------------------------------------------- */
  const btnBurstConfetti = document.getElementById('btnBurstConfetti');
  if (btnBurstConfetti) {
    btnBurstConfetti.addEventListener('click', () => {
      burstConfetti(90);
    });
  }

  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* -----------------------------------------------------------------
     8. PURE CANVAS CELEBRATION PARTICLES & CONFETTI ENGINE
     (Works 100% offline with vibrant yellow, gold, coral, and white)
     ----------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiParticles = [];
  const ambientSparkles = [];
  const CONFETTI_COLORS = [
    '#f59e0b', '#fbbf24', '#fde047', '#f97316', 
    '#fb7185', '#ec4899', '#10b981', '#ffffff'
  ];

  class ConfettiPiece {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 5;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.speedX = (Math.random() - 0.5) * 16;
      this.speedY = (Math.random() - 0.9) * 18 - 4;
      this.gravity = 0.35;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
      this.decay = Math.random() * 0.01 + 0.008;
      this.isHeart = Math.random() > 0.85;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.speedX *= 0.98;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        ctx.font = `${this.size * 1.5}px sans-serif`;
        ctx.fillText('💛', 0, 0);
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
      }
      ctx.restore();
    }
  }

  // Ambient gentle floating sparkles
  for (let i = 0; i < 30; i++) {
    ambientSparkles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.7 + 0.2
    });
  }

  function burstConfetti(count = 70) {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.65;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiPiece(
        startX + (Math.random() - 0.5) * 200, 
        startY + (Math.random() - 0.5) * 100
      ));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Ambient Sparkles
    ambientSparkles.forEach(sparkle => {
      sparkle.y += sparkle.speedY;
      sparkle.x += sparkle.speedX;
      if (sparkle.y < -10) sparkle.y = canvas.height + 10;
      if (sparkle.x < -10) sparkle.x = canvas.width + 10;
      if (sparkle.x > canvas.width + 10) sparkle.x = -10;

      ctx.save();
      ctx.globalAlpha = sparkle.alpha;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 2. Confetti Particles
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > canvas.height + 50) {
        confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

});
