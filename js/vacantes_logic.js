document.addEventListener("DOMContentLoaded", () => {
    const skeletonContainer = document.getElementById("vacancies-skeleton-container");
    const realContent = document.getElementById("no-vacancies-content");

    if (skeletonContainer && realContent) {
        setTimeout(() => {
            skeletonContainer.style.opacity = "0";
            skeletonContainer.style.transition = "opacity 0.5s ease";

            setTimeout(() => {
                skeletonContainer.style.display = "none";
                realContent.style.display = "block";

                // Trigger a reflow to enable transition
                void realContent.offsetWidth;

                realContent.style.opacity = "1";
                realContent.classList.add("fade-in"); // If using animations.css
            }, 500);

        }, 2000); // 2 seconds delay
    }
});
