"use strict";
const loginPage = {
    render() {
        let page = document.getElementById("header_slot");
        page.innerHTML = "";
        page = document.getElementById("postÜbersicht_slot");
        page.innerHTML = "";
        page = document.getElementById("detail_slot");
        page.innerHTML = "";
        page = document.getElementById("header").cloneNode(true);
        page.removeAttribute("id");
        page.innerHTML.replace("Eingeloggt als ${username}", "Nicht eingeloggt.");
        page.innerHTML.replace("Blognavigation", "");
        page.innerHTML.replace("${blogname} ${amountPosts}", "");
        page.getELementById("bloginfo").innerHTML ="";
        return page;
        // Alternative
        /*var div = document.getElementById('cart_item');
        while(div.firstChild){
        div.removeChild(div.firstChild);
        return div
        } */
    }
}
const header = {
    render(data){
        let page = document.getElementById("header").cloneNode(true);
        page.removeAttribute("id");
        setDataInfo(page, data);        
        return page;
    }
}

const detail = {
    render(data){
        let page = document.getElementById("detail").cloneNode(true);
        page.removeAttribute("id");
        setDataInfo(page, data);        
        return page;
    }
}

const postUebersicht = {
    render(data){
        let page = document.getElementById("postUebersicht").cloneNode(true);
        page.removeAttribute("id");
        setDataInfo(page, data);
        return page;
    }
}

function setDataInfo(element, object) {
    let cont = element.innerHTML;
    for (let key in object){
        let rexp = new RegExp("%" + key, "g");
        cont = cont.replace(rexp, object[key]);
    }
    element.innerHTML = cont;
}
