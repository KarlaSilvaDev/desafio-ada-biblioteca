const menuItems = document.querySelectorAll(".menu-item");
const contents = document.querySelectorAll(".tab-content");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        contents.forEach(content => content.classList.add("hidden"));
        menuItems.forEach(i => {
            i.classList.remove("bg-blue-50");
            i.classList.remove("ubuntu-bold");
        });
        const target = document.getElementById(item.dataset.tab);
        target.classList.remove("hidden");
        item.classList.add("bg-blue-50");
        item.classList.add("ubuntu-bold");
    });
});


const first = document.querySelector(".menu-item[data-tab='livros']");
if (first) first.click();
