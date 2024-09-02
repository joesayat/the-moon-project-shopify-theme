const sections = document.querySelectorAll("main > .shopify-section");

function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section-hidden");
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section-hidden");
});
