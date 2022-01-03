"use strict";

const header = {
    render(username, data){
        let page = document.getElementById("header").cloneNode(true);
        page.removeAttribute("id");
        page.innerHTML = page.innerHTML.replace("%username", username);
        let nav = page.getElementsByTagName("nav")[0];
        nav.innerHTML ="";
        for (let value of data){
            let str = '<p>' + value.blogname + ' (' + value.amountPosts + ')</p>';
            nav.insertAdjacentHTML('beforeend', str);
        }
        page.getElementsByTagName("h2")[1].innerHTML = '<h2><a href = ' + data[0].url + '>Bloginformationen - %blogname (%amountPosts)</a></h2>';
        setDataInfo(page, data[0]); 
        return page;
    }
};

const detail = {
    render(post, kommentare){
        let page = document.getElementById("detail").cloneNode(true);
        page.removeAttribute("id");
        page.getElementsByTagName("article")[1].innerHTML = "";        
        setDataInfo(page, post);        
        let section = page.getElementsByTagName("section")[0];
        section.removeAttribute("id");
        if (kommentare.length > 0){
            for (let k of kommentare){            
                let comments = document.getElementById("kommentare").cloneNode(true);
                comments.removeAttribute("id");
                setDataInfo(comments, k);    
                section.insertAdjacentHTML('beforeend', comments.innerHTML);
                
            }
        } else {
            page.getElementsByTagName("h3")[0].innerHTML.replace("%amountComments", "0");
        }
        return page;
    }
};

const postUebersicht = {
    render(data){
        let page = document.getElementById("postUebersicht").cloneNode(true);
        let overview = page.getElementsByTagName("article")[0];
        overview.innerHTML = "";        
        page.removeAttribute("id");
        for (let value of data){
            let nav = document.getElementById("article").cloneNode(true);
            nav.removeAttribute("id");
            setDataInfo(nav, value);
            overview.insertAdjacentHTML('beforeend', nav.innerHTML);
        }
        return page;
    }
};

function setDataInfo(element, object) {
    let cont = element.innerHTML;
    for (let key in object){
        let rexp = new RegExp("%" + key, "g");
        cont = cont.replace(rexp, object[key]);
    }
    element.innerHTML = cont;
};
