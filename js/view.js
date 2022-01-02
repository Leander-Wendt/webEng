"use strict";

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
