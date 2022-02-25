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

            
            blogId = blogs[0].id;
            let newBloginfo = bloginfo.render(blogs[0]);
            replace("bloginfo_slot", newBloginfo);
            
            init = true;

            //Falls auf Startseite, navigieren zu Uebersicht
            if (window.location.pathname === "/we-1/"){
                router.navigateToPage('/home/');
            }
            
            // Wenn fertig, rauswerfen
            /*model.getAllPostsOfBlog(blogId, (posts) => {
                console.log("--------------- Alle Posts des ersten Blogs --------------- ");
                if (!posts)
                    return;
                for (let p of posts) {
                    console.log(p);
                } 
                presenter.showBlogOverview(blogId);                         
                postId = posts[0].id;
                // presenter.showPostDetail(blogId, postId);
            });*/
        });
        
        let main = document.getElementById('main_slot');
        main.addEventListener("click", handleClicks);
        let nav = document.getElementById('blognavigation_slot');
        nav.addEventListener("click", handleClicks);
        let info = document.getElementById('bloginfo_slot');
        info.addEventListener("click", handleClicks);
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

    // Event Handler für alle Navigations-Events auf der Seite
    function handleClicks(event) {
        let source = null;
        // Behandelt werden clicks auf a-Tags, Buttons und Elemente,  
        // die in ein Li-Tag eingebunden sind.
        switch (event.target.tagName) {
            case "A":
                console.log("A");
                router.handleNavigationEvent(event);
                break;
            case "BUTTON" :
                console.log("BTN");
                source = event.target;
                break;
            default:
                console.log("Default");
                source = event.target.closest("LI");
                break;
        }
        if (source) {
            let path = source.dataset.path;
            if (path)
                router.navigateToPage(path);
        }
    }

    function replace (id, element){
        let main = document.getElementById(id);
        let content = main.firstElementChild;
        if (content){
            content.remove();
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
            if (model.isLoggedIn()) { 
                initPage();
            } else {
                console.log("Nicht eingeloggt");
                loginPage();
            }
        },
        // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
        showBlogOverview(bid) {
            console.log(`Aufruf von presenter.showBlogOverview(${bid})`);

            if (bid != blogId){
                blogId = bid;
                model.getBlog(bid, blog => {
                    let newblogInfo = bloginfo.render(blog);
                    replace("bloginfo_slot", newblogInfo); 
                });                
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