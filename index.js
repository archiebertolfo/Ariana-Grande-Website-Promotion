const boxes = document.querySelectorAll(".album-box");
let num = 0;

const albumText = document.getElementById("album-text");

const albumTexts = [
  "Yours Truly",
  "My Everything",
  "Dangerous Woman",
  "Sweetener",
  "Eternal Sunshine Deluxe",
  "eternal sunshine",
  "Positions",
  "Dangerous Woman (Tenth Anniversary Edition)",
  "Thank u, next",
];

const defaultAlbumText =
  "“ It is, as it always has been,<br>my greatest honor to grow with you. ” <br> -Ariana Grande";

boxes.forEach((box, index) => {
  // Using percentage positioning allows cards to overlap proportionally on small screens
  let percentX = index * -38; 

  if (index > 4) {
    box.style.transform = `translateX(${percentX}%) translateY(${(index - num) * -20}px) rotate(${index * 2}deg)`;
    num += 2;
  } else if (index === 4) {
    box.style.transform = `translateX(${percentX}%) translateY(-70px) rotate(0deg)`;
    num += 2;
  } else {
    box.style.transform = `translateX(${percentX}%) translateY(${index * -20}px) rotate(${(boxes.length - index) * -2}deg)`;
  }

  box.addEventListener("mouseenter", () => {
    if (albumText) albumText.innerHTML = albumTexts[index];
  });

  box.addEventListener("mouseleave", () => {
    if (albumText) albumText.innerHTML = defaultAlbumText;
  });

  const btn = box.querySelector(".album-button");
  if (btn) {
    btn.addEventListener("click", () => {
      const targetUrl = btn.getAttribute("data-link");
      if (targetUrl) window.open(targetUrl, "_blank");
    });
  }
});

const folders = document.querySelectorAll(".folders");

const folderStyle = ["concert1", "concert2", "concert3", "concert4"];

folders.forEach((folder, index) => {
  folder.addEventListener("click", (event) => {
    event.stopPropagation();
    folders.forEach((fold, foldIndex) => {
      if (foldIndex == index) {
        fold.classList.toggle(folderStyle[foldIndex]);
      } else {
        fold.classList.remove(folderStyle[foldIndex]);
      }
    });
  });
});

window.addEventListener("click", () => {
  folders.forEach((fold, index) => {
    fold.classList.remove(folderStyle[index]);
  });
});

function updateNavbarColor() {
  const currentPath = window.location.hash;
  const navbar = document.querySelector("nav");
  if (!navbar) return;

  if (currentPath.includes("#events")) {
    navbar.classList.add("events-nav-bg"); 
  } else {
    navbar.classList.remove("events-nav-bg"); 
  }
}

/* ============================================
   MERCHANDISE CAROUSEL FUNCTIONALITY
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".product-carousel");

  carousels.forEach((carousel) => {
    const container = carousel.closest(".carousel-container");
    if (!container) return;
    
    const prevBtn = container.querySelector(".prev-btn");
    const nextBtn = container.querySelector(".next-btn");
    const wrapper = container.querySelector(".carousel-wrapper");

    const scrollAmount = 250; 

    if (prevBtn && wrapper) {
      prevBtn.addEventListener("click", () => {
        wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    }

    if (nextBtn && wrapper) {
      nextBtn.addEventListener("click", () => {
        wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  });
});

const sorter = document.querySelector(".sort-btn");
const dropDown = document.querySelector(".dropdown-content");
const sortButton = document.querySelector(".sort-btn span");
const dropItem = document.querySelectorAll(".drop-item");

if (sorter && dropDown) {
  sorter.addEventListener("click", function (event) {
    dropDown.style.display = "flex";
    event.stopPropagation();
  });

  dropItem.forEach((item) => {
    item.addEventListener("click", function () {
      if (sortButton) sortButton.innerHTML = item.innerHTML;
    });
  });

  window.addEventListener("click", (event) => {
    if (!sorter.contains(event.target)) dropDown.style.display = "none";
  });
}

window.addEventListener("DOMContentLoaded", updateNavbarColor);
window.addEventListener("hashchange", updateNavbarColor);

window.addEventListener("scroll", () => {
  const navbar = document.querySelector("nav");
  if (!navbar) return;
  
  const targetVhInPixels = 180 * (window.innerHeight / 100);

  if (window.scrollY > targetVhInPixels) {
    navbar.classList.add("events-nav-bg");
  } else {
    navbar.classList.remove("events-nav-bg");
  }
});

/* ============================================
   SEARCH / CART FILTER FUNCTIONALITY
   ============================================ */
const myCart = document.querySelector("#mycart");
const productItem = document.querySelectorAll(".product-item");

if (myCart) {
  myCart.addEventListener("input", function () {
    const term = myCart.value.toLowerCase().trim();

    productItem.forEach((product) => {
      const nameElement = product.querySelector(".product-name");
      const imgElement = product.querySelector(".product-image img");
      const priceElement = product.querySelector(".product-price");

      if (nameElement && term !== "") {
        const productName = nameElement.textContent.toLowerCase();
        
        // Changed to .includes() to match your search text input correctly
        if (productName.includes(term)) {
          if (imgElement) imgElement.src = "assets/circle1.png"; 
          nameElement.textContent = "Sweetener Tote Bag"; 
          if (priceElement) priceElement.textContent = "£25.00";
        }
      }
    });
  });
}

/* ============================================
   CART LAYOUT TOGGLE FUNCTIONALITY
   ============================================ */
const cartOrders = document.querySelector('.cart-orders');
const cart = document.querySelector('.cart');
const orderButtons = document.querySelectorAll('.order-button');

// 1. Isolate the order button bubbles cleanly
orderButtons.forEach(button => {
  button.addEventListener("click", function(event) {
    event.stopPropagation();
  });
});
  
// 2. Separate logic to open cart panel safely
if (cart && cartOrders) {
  cart.addEventListener("click", function (event) {
    cartOrders.style.display = "block";
    event.stopPropagation();
  });

  // 3. Clear window blur clicks without infinite loops
  window.addEventListener("click", (event) => {
    let clickedAnOrderBtn = false;
    orderButtons.forEach(button => {
      if (button.contains(event.target)) clickedAnOrderBtn = true;
    });

    if (!cart.contains(event.target) && !clickedAnOrderBtn) {
      cartOrders.style.display = "none";
    }
  });
}

/* ============================================
   MOBILE TABLES SLIDESHOW ENGINE (SMOOTH ANIMATED)
   ============================================ */
function initMobileTableSlider() {
  const eventPage = document.querySelector("#event-page");
  const slideFolders = document.querySelectorAll(".folders");
  if (!eventPage || slideFolders.length === 0) return;

  eventPage.setAttribute("data-slider-ready", "true");

  let currentSlideIndex = 0;
  let isAnimating = false; // Prevents button spam during transitions

  // Build the control panel bar interface elements
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "slider-controls";

  const prevButton = document.createElement("button");
  prevButton.className = "slide-btn prev-slide";
  prevButton.innerText = "← Previous";

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "slide-dots";

  const nextButton = document.createElement("button");
  nextButton.className = "slide-btn next-slide";
  nextButton.innerText = "Next →";

  slideFolders.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.className = idx === 0 ? "slide-dot active-dot" : "slide-dot";
    dotsContainer.appendChild(dot);
  });

  controlsContainer.appendChild(prevButton);
  controlsContainer.appendChild(dotsContainer);
  controlsContainer.appendChild(nextButton);
  eventPage.appendChild(controlsContainer);

  const dots = dotsContainer.querySelectorAll(".slide-dot");

  // Core animated navigation display logic
  function renderSlideDisplay(targetIndex) {
    if (isAnimating) return; 
    isAnimating = true;

    const currentSlide = slideFolders[currentSlideIndex];
    
    // Calculate new index bounds
    let nextSlideIndex = targetIndex;
    if (targetIndex >= slideFolders.length) nextSlideIndex = 0;
    else if (targetIndex < 0) nextSlideIndex = slideFolders.length - 1;

    // 1. Fade out the old active slide
    currentSlide.classList.remove("fade-in-active");

    // 2. Wait for fade out animation to finish (350ms matching CSS transition)
    setTimeout(() => {
      currentSlide.classList.remove("active-slide");

      // Update index tracker tracking tracks
      currentSlideIndex = nextSlideIndex;
      const nextSlide = slideFolders[currentSlideIndex];

      // 3. Make the new slide block active, then kick off opacity on next execution tick
      nextSlide.classList.add("active-slide");
      
      setTimeout(() => {
        nextSlide.classList.add("fade-in-active");
        isAnimating = false;
      }, 20);

      // Update tracker navigation dot active state colors
      dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
          dot.classList.add("active-dot");
        } else {
          dot.classList.remove("active-dot");
        }
      });
    }, 350);
  }

  // Click event monitoring listeners (Blocks conflicting background window events)
  prevButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    renderSlideDisplay(currentSlideIndex - 1);
  });

  nextButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    renderSlideDisplay(currentSlideIndex + 1);
  });

  // Initialize initial display target states
  slideFolders[0].classList.add("active-slide");
  setTimeout(() => {
    slideFolders[0].classList.add("fade-in-active");
  }, 20);
}

// Desktop window return clearance logic
function cleanUpMobileSlider() {
  const eventPage = document.querySelector("#event-page");
  if (!eventPage) return;

  eventPage.removeAttribute("data-slider-ready");
  const controls = eventPage.querySelector(".slider-controls");
  if (controls) controls.remove();
  
  document.querySelectorAll(".folders").forEach(folder => {
    folder.classList.remove("active-slide", "fade-in-active");
  });
}

// Watch layout size changes
function checkResponsiveLayoutViewport() {
  const eventPage = document.querySelector("#event-page");
  if (!eventPage) return;

  if (window.innerWidth <= 1400) {
    if (eventPage.getAttribute("data-slider-ready") !== "true") {
      initMobileTableSlider();
    }
  } else {
    if (eventPage.getAttribute("data-slider-ready") === "true") {
      cleanUpMobileSlider();
    }
  }
}

window.addEventListener("DOMContentLoaded", checkResponsiveLayoutViewport);
window.addEventListener("resize", checkResponsiveLayoutViewport);

/* ============================================
   MOBILE RESPONSIVE NAVIGATION MENU ENGINE
   ============================================ */
function initMobileNavigationMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (!menuToggle || !navLinks) return;

  // 1. Toggle mobile menu drawer visibility when clicking hamburger bar icon
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("nav-menu-open");
  });

  // 2. Automatically shut drawer panel whenever an internal jump link target is clicked
  const menuAnchorLinks = navLinks.querySelectorAll("a");
  menuAnchorLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("nav-menu-open");
    });
  });

  // 3. Clear visibility tracking state if a user clicks outside open drawer boundaries
  window.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("nav-menu-open");
    }
  });
}

// Kickstart script execution hook instantly on runtime initialization
window.addEventListener("DOMContentLoaded", initMobileNavigationMenu);
