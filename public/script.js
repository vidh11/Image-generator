let dynamicText;
if (window.innerWidth < 500) {
    dynamicText = document.querySelector(".website__title .title .title-500");
} else {
    dynamicText = document.querySelector(".website__title .title p span");
}
const words = ["generateImage", "createMagic", "summonImage", "paintPicture", "mystify", "explore", "discover", "enchant"];

let wordIndex = 0;
let charIndex = 1;
let isDeleting = false;

const typeEffect = () => {
    let currentWord = words[wordIndex];
    let currentChar = currentWord.substring(0, charIndex);
    dynamicText.textContent = currentChar;
    dynamicText.classList.add("stop-blinking");

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 250);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 100);
    } else {
        isDeleting = !isDeleting;
        dynamicText.classList.remove("stop-blinking");
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1200);
    }
};

document.querySelector(".hamburger").onclick = function () {
    document.querySelector(".nav-bar").classList.toggle("active");
    document.querySelector("main").classList.toggle("active");
}

typeEffect();


//home active tab highlight
document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.href === window.location.href) {
        if (window.location.pathname === "/about") {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "styles/theme-about.css";

            document.head.appendChild(link);
        }
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
});


//Gallery
function addDownloadBtn(){
    let downloadBtn = document.querySelectorAll('.downloadBtn')
    image = document.querySelectorAll('[data-downloadImg]')

    function toDataURL(url) {
        return fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            return URL.createObjectURL(blob);
        })
    }

    async function download(url) {
        const a = document.createElement("a");
        a.href = await url;
        a.download = "Download.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    downloadBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            let imageURL = btn.parentElement.querySelector('img').src
            download(toDataURL(imageURL))
        })
    })
}

document.querySelector(".seeMore").addEventListener("click", async (event) => {
    event.preventDefault();
    const button = event.target;
    const currentPage = parseInt(button.dataset.page);
    const searchWord = (button.dataset.word);
    //console.log(button);

    try {
        const response = await fetch(`/load-more?page=${currentPage + 1}&searchWord=${searchWord}`);
        if (response.ok) {
            const newImages = await response.json();
            if (newImages.length > 0) {
                newImages.forEach((imageUrl) => {
                    const imageContainer = document.createElement("div");
                    imageContainer.className = "imageContainer";

                    const downloadBtn=document.createElement("div");
                    downloadBtn.className="downloadBtn";
                    const icon=document.createElement("i");
                    icon.className="fa-solid fa-arrow-down";
                    downloadBtn.appendChild(icon);

                    const img = document.createElement("img");
                    img.src = imageUrl;
                    img.alt = "searched-img";
                    img.setAttribute("data-downloadImg", "");

                    imageContainer.appendChild(downloadBtn);
                    imageContainer.appendChild(img);
                    document.querySelector(".gallery_container").appendChild(imageContainer);
                });

                const seeMoreBtn= document.getElementsByClassName("seeMore")[0];
                const container=document.querySelector(".gallery_container");

                function moveToBottom(){
                    if(seeMoreBtn && container){
                        container.append(seeMoreBtn);
                    }
                }
                moveToBottom();
                //console.log(seeMoreBtn);
                
                // Update the button's data-page attribute
                button.dataset.page = currentPage + 1;

                // If you've reached a total of 30 images, hide the button
                if (currentPage + 1 === 6) {
                    button.style.display = "none";
                }
            } 
            else {
                button.style.display = "none"; // No more images to load
            }
            addDownloadBtn();
        }
    } 
    catch (error) {
        console.error(error);
    }
});

addDownloadBtn();