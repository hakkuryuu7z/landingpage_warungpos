// Interactive Logic for WarungPOS Landing Page

document.addEventListener('DOMContentLoaded', () => {

  // 1. MOBILE MENU TOGGLE
  const btnMobileMenu = document.getElementById('btn-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if (btnMobileMenu && mobileMenu) {
    btnMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. INTERACTIVE UMKM PROFIT & TIME CALCULATOR
  const calcTrans = document.getElementById('calc-trans');
  const calcBasket = document.getElementById('calc-basket');
  const calcTransVal = document.getElementById('calc-trans-val');
  const calcBasketVal = document.getElementById('calc-basket-val');
  const calcOmsetRes = document.getElementById('calc-omset-res');
  const calcTimeRes = document.getElementById('calc-time-res');

  function updateCalculations() {
    if (!calcTrans || !calcBasket) return;

    const transCount = parseInt(calcTrans.value) || 60;
    const basketSize = parseInt(calcBasket.value) || 35000;

    // Update text labels
    calcTransVal.textContent = `${transCount} Nota / hari`;
    calcBasketVal.textContent = `Rp ${basketSize.toLocaleString('id-ID')}`;

    // Calculations
    const dailyOmset = transCount * basketSize;
    const monthlyOmset = dailyOmset * 30;

    // Time saved calculation (assuming ~1 minute saved per transaction in logging/checkout + end-of-day reconciliation)
    const minutesSavedDaily = (transCount * 1.5) + 30;
    const hoursSavedMonthly = Math.round((minutesSavedDaily * 30) / 60);

    // Update UI Results
    if (calcOmsetRes) calcOmsetRes.textContent = `Rp ${monthlyOmset.toLocaleString('id-ID')}`;
    if (calcTimeRes) calcTimeRes.textContent = `${hoursSavedMonthly} Jam / Bulan`;
  }

  if (calcTrans && calcBasket) {
    calcTrans.addEventListener('input', updateCalculations);
    calcBasket.addEventListener('input', updateCalculations);
    updateCalculations();
  }

  // 3. FAQ ACCORDION TOGGLE
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const isActive = toggle.classList.contains('active');

      // Close all other open FAQs
      faqToggles.forEach(otherToggle => {
        otherToggle.classList.remove('active');
        if (otherToggle.nextElementSibling) {
          otherToggle.nextElementSibling.classList.add('hidden');
        }
      });

      // Toggle clicked FAQ
      if (!isActive) {
        toggle.classList.add('active');
        content.classList.remove('hidden');
      }
    });
  });

  // 4. HEADER BACKDROP SCROLL SHADOW
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('shadow-xl', 'bg-slate-950/95');
      header.classList.remove('bg-slate-950/80');
    } else {
      header.classList.remove('shadow-xl', 'bg-slate-950/95');
      header.classList.add('bg-slate-950/80');
    }
  });

  // 5. LATEST .EXE RELEASE FETCHER (FOR PRIVATE REPOSITORIES & WEB HOSTING)
  function applyReleaseData(data) {
    if (!data || !data.version) return;
    const downloadBtns = document.querySelectorAll('.btn-download-exe');
    const versionBadges = document.querySelectorAll('.version-text');
    const releaseDateTexts = document.querySelectorAll('.release-date-text');
    const fileSizeTexts = document.querySelectorAll('.file-size-text');

    const formattedVersion = data.version.startsWith('v') ? data.version : `v${data.version}`;
    const versionClean = data.version.replace(/^v/, '');
    const defaultVersionUrl = `./downloads/WarungPOS-Setup-v${versionClean}.exe`;
    const finalUrl = data.downloadUrl || defaultVersionUrl;
    const fileName = finalUrl.split('/').pop();

    downloadBtns.forEach(btn => {
      btn.href = finalUrl;
      btn.setAttribute('download', fileName);
      btn.setAttribute('data-version', formattedVersion);
    });

    versionBadges.forEach(el => {
      el.textContent = formattedVersion;
    });

    if (data.releaseDate) {
      releaseDateTexts.forEach(el => el.textContent = data.releaseDate);
    }

    if (data.fileSize) {
      fileSizeTexts.forEach(el => el.textContent = data.fileSize);
    }
  }

  async function fetchLatestReleaseInfo() {
    // 1. Baca langsung dari window.WARUNG_POS_LATEST (disediakan oleh latest.js, bebas CORS di file:// dan http://)
    if (window.WARUNG_POS_LATEST) {
      applyReleaseData(window.WARUNG_POS_LATEST);
      return;
    }

    // 2. Fetch ./latest.json over HTTP
    try {
      const response = await fetch('./latest.json');
      if (response.ok) {
        const data = await response.json();
        applyReleaseData(data);
      }
    } catch (err) {
      console.warn('Gagal membaca ./latest.json:', err.message);
    }
  }

  fetchLatestReleaseInfo();

});



