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

    
    // Initialisiert die allgemeinen Teile der Seite
    function initPage() {
        console.log("Presenter: Aufruf von initPage()");

        document.getElementsByTagName("h2")[0].hidden = false;
        // Hier werden zunächst nur zu Testzwecken Daten vom Model abgerufen und auf der Konsole ausgegeben 
        
        // Nutzer abfragen und Anzeigenamen als owner setzen
        model.getSelf((result) => {
            owner = result.displayName;
            console.log(`Presenter: Nutzer*in ${owner} hat sich angemeldet.`);
            let newUsername = username.render(owner);
            replace("username_slot", newUsername);
        });
        model.getAllBlogs((blogs) => {
            console.log("--------------- Alle Blogs --------------- ");
            if (!blogs)
                return;

            for (let b of blogs) {
                console.log(b);
            }
            
            let newBlognavigation = blognavigation.render(blogs);
            replace("blognavigation_slot", newBlognavigation);

            let newBloginfo = bloginfo.render(blogs[0]);
            replace("blognavigation_slot", newBloginfo);
            blogId = blogs[0].id;
            
            // Das muss später an geeigneter Stelle in Ihren Code hinein.
            init = true;
            //Falls auf Startseite, navigieren zu Uebersicht
            if (window.location.pathname === "/")
                router.navigateToPage('/blogOverview/' + blogId);
            
            // Wenn fertig, rauswerfen
            model.getAllPostsOfBlog(blogId, (posts) => {
                console.log("--------------- Alle Posts des ersten Blogs --------------- ");
                if (!posts)
                    return;
                for (let p of posts) {
                    console.log(p);
                } 
                //presenter.showBlogOverview(blogId);                         
                postId = posts[0].id;
                presenter.showPostDetail(blogId, posts[1].id);
                model.getAllCommentsOfPost(blogId, postId, (comments) => {
                    console.log("--------------- Alle Comments des zweiten Post --------------- ");
                    if (!comments)
                        return;
                    for (let c of comments) {
                        console.log(c);
                    }  
                    
                });
            });
        });            
    }
    // Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
    // und der Login-Button angezeigt wird.
    function loginPage() {
        console.log("Presenter: Aufruf von loginPage()");
        if(owner !== undefined) console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`);

        replace("main_slot", null);
        replace("blognavigation_slot", null);
        replace("bloginfo_slot", null);
        
        let newUsername = username.render("");
        replace("username_slot", newUsername);

        document.getElementsByTagName("h2")[0].hidden = true;

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

            if (bid != blogId){
                blogId = bid;
                let newblogInfo = blogInfo.render(bid);
                replace("bloginfo_slot", newblogInfo); 
            }

            model.getAllPostsOfBlog(bid, (posts) => {
                if (!posts){
                    return;
                }
                let newPostUebersicht = postUebersicht.render(posts);
                replace("main_slot", newPostUebersicht);  
            });    
        },

        showPostDetail(bid, pid) {
            // eventuell optional, könnte Fehler verursachen
            if (postId != pid){
                postId = pid;
            } 
            console.log(`Aufruf von presenter.showPostDetail(${pid})`);
            model.getPost(bid, pid, (post) => {
                if (post.amountComments > 0){
                    model.getAllCommentsOfPost(bid, pid, (comments) => {                
                        let newDetail = detail.render(post, comments);
                        replace("main_slot", newDetail);
                    });
                } else {
                    let newDetail = detail.render(post, null);
                    replace("main_slot", newDetail);
                }
            }); 
        }        
    };
})();