const carousel = document.querySelector(".product-carousel-list");
const img = document.querySelector(".product-carousel-img");
const imgs = [...document.querySelectorAll(".product-carousel-img")];
const btnsContainer = document.querySelector(".product-carousel-btns");
const indicatorsContainer = document.querySelector(
  ".product-carousel-indicators"
);

function calculateImageIndex() {
  return Math.ceil(carousel.scrollLeft / img.clientWidth);
}

function scrollLeft() {
  carousel.scrollLeft -= img.clientWidth;
}

function scrollRight() {
  carousel.scrollLeft += img.clientWidth;
}

function scrollToImg(index) {
  carousel.scrollLeft = img.clientWidth * index;
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
  const index = calculateImageIndex();
  renderActiveIndicator(index);
}

function handleIndicatorClick(e) {
  if (!e.target.closest(".product-carousel-indicator")) return;

  const index = Number(e.target.dataset.index);

  scrollToImg(index);
  renderActiveIndicator(index);
}

function handleScrollEnd() {
  const index = calculateImageIndex();
  renderActiveIndicator(index);
}

function initialize() {
  renderIndicators();
}

initialize();

btnsContainer.addEventListener("click", handleBtnClick);
indicatorsContainer.addEventListener("click", handleIndicatorClick);
carousel.addEventListener("scrollend", handleScrollEnd);
