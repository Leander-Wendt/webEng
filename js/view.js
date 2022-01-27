"use strict";

const username = {
    render(name){
        let page = document.getElementById("username").cloneNode(true);
        page.removeAttribute("id");
        if (name === "" || name === null){
            page.children[0].innerHTML = "Nicht angemeldet.";
        } else {            
            page.innerHTML = page.innerHTML.replace("%username", name);
        }
        return page;    
    }
};

const blognavigation = {
    render(blogs){
        let page = document.getElementById("blognavigation").cloneNode(true);
        page.removeAttribute("id");        
        let li = page.querySelector("li");
        page.removeChild(li);
        for (let blog of blogs) {
            page.appendChild(li);
            helper.setDataInfo(page, blog);
        }        
        return page;    
    }
};

const bloginfo = {
    render(blog){
        let page = document.getElementById("bloginfo").cloneNode(true);
        page.removeAttribute("id");
        blog.setFormatDates(false);
        helper.setDataInfo(page, blog);     
        return page;    
    }
};

const detail = {
    render(post, kommentare){
        post.setFormatDates(true);
        let page = document.getElementById("detail").cloneNode(true);
        page.removeAttribute("id");

        let kommentarTemplate = page.querySelectorAll("article")[1];
        page.removeChild(kommentarTemplate);

        helper.setDataInfo(page, post);
        if (kommentare){
            for (let kommentar of kommentare){                  
                kommentar.setFormatDates(true);   
                page.appendChild(kommentarTemplate);
                helper.setDataInfo(kommentarTemplate, kommentar);                
            }
        }
        return page;
    }
};

const postUebersicht = {
    render(posts){
        let page = document.getElementById("postUebersicht").cloneNode(true);       
        page.removeAttribute("id");
        let article = page.querySelector("article");
        page.removeChild(article);
        for (let post of posts){
            post.setFormatDates(false);
            page.appendChild(article);
            helper.setDataInfo(page, post);
        }
        return page;
    }
};

const helper = {
    setDataInfo(element, object) {
        let cont = element.innerHTML;
        for (let key in object){
            let rexp = new RegExp("%" + key, "g");
            cont = cont.replace(rexp, object[key]);
        }
        element.innerHTML = cont;
    }
};
