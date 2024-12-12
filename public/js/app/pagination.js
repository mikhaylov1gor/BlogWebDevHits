import {getURLParams, updateURLParams} from "./app.js";

const buttonsCount = 5;
function renderButton(number, current) {
    const button = document.createElement('a');
    button.textContent = number;
    if (number === current){
        button.classList.add("active");
    }

    button.addEventListener("click", (event)=>{
       event.preventDefault();

       updateURLParams("page", number);
       history.pushState({ page: number }, '', window.location.href);
       window.location.reload();
    });

    return button;
}

function renderButtons(count,current){
    const buttonsContainer = document.getElementById("navigation-buttons");
    buttonsContainer.innerHTML = "";

    const prevButton = document.createElement('a');
    const nextButton = document.createElement('a');

    prevButton.innerHTML = "&laquo;";
    nextButton.innerHTML = "&raquo";

    buttonsContainer.appendChild(prevButton);
    if (current < buttonsCount/2 && buttonsCount > count){
        for (let i = 1; i < count + 1; i++){
            const buttonElement = renderButton(i, current);
            buttonsContainer.appendChild(buttonElement);
        }
    }
    else if (current < buttonsCount/2 && buttonsCount <= count){
        for (let i = 1; i < buttonsCount + 1; i++){
            const buttonElement = renderButton(i, current);
            buttonsContainer.appendChild(buttonElement);
        }
    }
    else if ( current > count - buttonsCount/2){
        for (let i = current - 2; i < count + 1; i++){
            const buttonElement = renderButton(i, current);
            buttonsContainer.appendChild(buttonElement);
        }
    }
    else{
        for (let i = current - 2; i < current + buttonsCount - 2; i++){
            const buttonElement = renderButton(i, current);
            buttonsContainer.appendChild(buttonElement);
        }
    }
    buttonsContainer.appendChild(nextButton);

    prevButton.addEventListener("click", (event) =>{
        event.preventDefault();

        if(current === 1){
            return;
        }

        updateURLParams("page", current - 1);
        history.pushState({ page: current - 1 }, '', window.location.href);
        window.location.reload();
    })

    nextButton.addEventListener("click", (event) =>{
        event.preventDefault();

        if(current === count){
            return;
        }

        updateURLParams("page", current + 1);
        history.pushState({ page: current + 1 }, '', window.location.href);
        window.location.reload();
    })
}
export async function initializePagination(size,count,current){
    console.log(size,count,current);

    const pagination = document.querySelector("body");
    if (!pagination) {
        return;
    }

    const urlParams = getURLParams();
    if (urlParams.page) {
        const pageElement = document.getElementById("pageSize").options;
        for (let i = 0; i < pageElement.length; i++) {
            if (urlParams.size === pageElement[i].value){
                pageElement[i].selected = true;
                break;
            }
        }
    }

    renderButtons(count,current);

    const selector =  pagination.querySelector("#pageSize");
    selector.addEventListener("change", (event)=>{
        event.preventDefault();
        const selected = selector.options[selector.selectedIndex];
        updateURLParams("size", selected.value);
        updateURLParams("page", 1);
        window.location.reload();
    });
}

window.addEventListener("popstate", (event) => {
    if (event.state) {
        const { page, size } = event.state;
        updateURLParams("page", page || 1);
        updateURLParams("size", size || 5);
        renderButtons(size, page);
    }
});