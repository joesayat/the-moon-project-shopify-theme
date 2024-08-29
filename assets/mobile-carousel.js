const carousel = document.querySelector(".product-carousel-list");
const imgs = [...document.querySelectorAll(".product-carousel-img")];
const btnsContainer = document.querySelector(".product-carousel-btns");
const indicatorsContainer = document.querySelector(
  ".product-carousel-indicators"
);
let timeout;

function calculateImageIndex() {
  return Math.round(carousel.scrollLeft / carousel.offsetWidth);
}

function scrollLeft() {
  carousel.scrollLeft -= carousel.offsetWidth;
}

function scrollRight() {
  carousel.scrollLeft += carousel.offsetWidth;
}

function scrollToImg(index) {
  carousel.scrollLeft = carousel.offsetWidth * index;
}

function renderActiveIndicator(ind) {
  const indicators = document.querySelectorAll(".product-carousel-indicator");
  const index = ind || 0;

  imagePosition = index;
  indicators.forEach((el) => el.classList.remove("active"));
  indicators[index].classList.add("active");
}

function renderIndicators() {
  const html = imgs
    .map(
      (_, index) => `<button
    class="product-carousel-indicator"
    data-index=${index}
    ></button>`
    )
    .join("");

  indicatorsContainer.insertAdjacentHTML("afterbegin", html);
  renderActiveIndicator();
}

function handleBtnClick(e) {
  if (!e.target.closest(".product-carousel-btn")) return;

  e.target.closest('[name="left"]') ? scrollLeft() : scrollRight();
}

function handleIndicatorClick(e) {
  if (!e.target.closest(".product-carousel-indicator")) return;

  const index = Number(e.target.dataset.index);

  scrollToImg(index);
}

function handleScrollEnd() {
  let atSnappingPoint = carousel.scrollLeft % carousel.offsetWidth === 0;
  let timer = atSnappingPoint ? 0 : 150;

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const index = calculateImageIndex();
    renderActiveIndicator(index);
  }, timer);
}

function initialize() {
  renderIndicators();
}

initialize();

btnsContainer.addEventListener("click", handleBtnClick);
indicatorsContainer.addEventListener("click", handleIndicatorClick);
carousel.addEventListener("scroll", handleScrollEnd);
