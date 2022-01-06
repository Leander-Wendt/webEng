/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";
const presenter = (function () {
    // Private Variablen und Funktionen
    let init = false;
    let blogId = -1;
    let postId = -1;
    let owner = undefined;

    // Nur für Präsentationszwecke
    function a (){
        presenter.showBlogOverview('3906099986217311772');
    }
    // Nur für Präsentationszwecke
    function b (){
        presenter.showPostDetail('3906099986217311772', '1721573201785608361');
    }
    // Initialisiert die allgemeinen Teile der Seite
    function initPage() {
        console.log("Presenter: Aufruf von initPage()");       

        // Nur für Präsentationszwecke
        let btn = document.createElement("button");
        btn.innerHTML = "Präsentiere Blogübersicht";
        btn.addEventListener('click', a);
        document.getElementById("header_slot").appendChild(btn);
        let btn2 = document.createElement("button");
        btn2.innerHTML = "Präsentiere Postdetailsicht";
        btn2.addEventListener('click', b);
        document.getElementById("header_slot").appendChild(btn2);


        // Hier werden zunächst nur zu Testzwecken Daten vom Model abgerufen und auf der Konsole ausgegeben 
         
        // Nutzer abfragen und Anzeigenamen als owner setzen
        model.getSelf((result) => {
            owner = result.displayName;
            console.log(`Presenter: Nutzer*in ${owner} hat sich angemeldet.`);
        });
        model.getAllBlogs((blogs) => {
            console.log("--------------- Alle Blogs --------------- ");
            if (!blogs)
                return;
            for (let b of blogs) {
                console.log(b);
            }
            
            let newHeader = header.render(owner, blogs);
            replace("header_slot", newHeader);
            blogId = blogs[0].id            
            model.getAllPostsOfBlog(blogId, (posts) => {
                console.log("--------------- Alle Posts des ersten Blogs --------------- ");
                if (!posts)
                    return;
                for (let p of posts) {
                    console.log(p);
                } 
                //let newPostUebersicht = postUebersicht.render(posts);
                //replace("postUebersicht_slot", newPostUebersicht);                               
                postId = posts[0].id;
                model.getAllCommentsOfPost(blogId, postId, (comments) => {
                    console.log("--------------- Alle Comments des zweiten Post --------------- ");
                    if (!comments)
                        return;
                    for (let c of comments) {
                        console.log(c);
                    }  
                    
                    //let newDetail = detail.render(posts[0], comments);
                    //replace("detail_slot", newDetail);
                });
            });
        });
        // Das muss später an geeigneter Stelle in Ihren Code hinein.
        init = true;
        //Falls auf Startseite, navigieren zu Uebersicht
        if (window.location.pathname === "/")
            router.navigateToPage('/blogOverview/' + blogId);
    }
    // Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
    // und der Login-Button angezeigt wird.
    function loginPage() {
        console.log("Presenter: Aufruf von loginPage()");
        if(owner !== undefined) console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`);

        document.getElementById("postUebersicht_slot").innerHTML = "";
        document.getElementById("detail_slot").innerHTML = "";
        let page = document.getElementById("header").cloneNode(true);
        page.removeAttribute("id");     

        let parent = page.children[0];
        let children = parent.children;
        console.log(parent);
        console.log(children);
        console.log(page);
    
        children[3].innerHTML = "Nicht eingeloggt.";
        children[4].innerHTML = "";
        children[5].innerHTML = "";
        children[7].innerHTML = "";
        parent.removeChild(parent.getElementsByTagName("hr")[0]);
        parent.removeChild(parent.getElementsByTagName("hr")[0]);

        replace("header_slot", page);

        init = false;
        blogId = -1;
        postId = -1;
        owner = undefined;        
    }

    function replace (id, element){
        let main = document.getElementById(id);
        let content = main.firstElementChild;
        if (content){
            content.remove;
        }
        if (element){
            main.append(element);
        }
    }


    //Oeffentliche Methoden
    return {
        // Wird vom Router aufgerufen, wenn die Startseite betreten wird
        showStartPage() {
            console.log("Aufruf von presenter.showStartPage()");
            // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
            if (model.isLoggedIn()) { // Wenn der Nutzer eingeloggt ist
                // Nur für Präsentationszwecke
                initPage();
            }
            if (!model.isLoggedIn()) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
                //Hier wird die Seite ohne Inhalt angezeigt
                console.log("Nicht eingeloggt");
                loginPage();
            }
        },
        // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
        showBlogOverview(bid) {
            console.log(`Aufruf von presenter.showBlogOverview(${bid})`);
            model.getAllPostsOfBlog(bid, (posts) => {
                if (!posts){
                    return;
                }
                let newPostUebersicht = postUebersicht.render(posts);
                replace("postUebersicht_slot", newPostUebersicht);  
            });    
        },

        showPostDetail(bid, pid) {
            console.log(`Aufruf von presenter.showPostDetail(${pid})`);
            model.getPost(bid, pid, (post) => {
                model.getAllCommentsOfPost(bid, pid, (comments) => {                
                    let newDetail = detail.render(post, comments);
                    replace("detail_slot", newDetail);
                });
            }); 
        }        
    };
})();