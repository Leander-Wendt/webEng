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

        function handleActionButtons(event) {
            let source = event.target.closest('LI');
            if (source) {
                let action = source.dataset.action;
                let blogId = source.dataset.blogid;
                let postId = source.dataset.postid;
                if (action === "deletePost" && confirm('Wollen Sie die den Post wirklich löschen?')) {
                    presenter[action]();
                } else if (action === "deleteComment" && confirm('Wollen Sie die den Kommentar wirklich löschen?')){
                    let commentId = source.dataset.commentid;
                    let comment = source.closest('ARTICLE');
                    comment.remove();
                    presenter[action](commentId);
                    presenter.showPostDetail(blogId, postId);
                } else if (action === "editPost") {
                    router.navigateToPage("/editPost/" + blogId + "/" + postId);
                }
            }
        }
        
        // löst ein Problem, welches auftritt nachdem ein Kommentar gelöscht wurde und die Seite aktualisiert wird,
        // die API benötigt Zeit um die Datenpakete zu aktualisieren was darin endet, dass post.amountComments noch den alten Wert enthält
        if (kommentare){
            post.amountComments = kommentare.length;
        }

        post.setFormatDates(true);
        let page = document.getElementById("detail").cloneNode(true);
        page.removeAttribute("id");

        let kommentarTemplate = page.querySelectorAll("article")[1];
        page.removeChild(kommentarTemplate);

        helper.setDataInfo(page, post);

        kommentare?.forEach (kommentar => {                            
            kommentar.setFormatDates(true);
            page.appendChild(kommentarTemplate);
            helper.setDataInfo(page, kommentar);                
        });

        page.addEventListener("click", handleActionButtons);
        return page;
    }
};

const postUebersicht = {
    render(posts){

        function handleActionButtons(event) {
            let source = event.target.closest('LI');
            if (source) {
                let action = source.dataset.action;
                let blogId = source.dataset.blogid;
                let postId = source.dataset.postid;
                if (action === "deletePost" && confirm('Wollen Sie die den Post wirklich löschen?')) {
                    let post = source.closest('ARTICLE');
                    post.remove();
                    presenter[action]();
                } else if (action === "editPost") {
                    router.navigateToPage("/editPost/" + blogId + "/" + postId);
                }
            }
        }

        let page = document.getElementById("postUebersicht").cloneNode(true);       
        page.removeAttribute("id");
        let article = page.querySelector("article");
        page.removeChild(article);
        for (let post of posts){
            post.setFormatDates(false);
            page.appendChild(article);
            helper.setDataInfo(page, post);
        }

        page.addEventListener("click", handleActionButtons);
        return page;
    }
};

const newPost = {

    render(blogId) {
        function handleActionButtons(event) {
            let source = event.target;
            if (source) {
                let action = source.dataset.action;

                if (action === "saveNewPost" && confirm(`Wollen Sie die Änderungen wirklich speichern?`)) {
                    event.preventDefault();
                    let form = document.forms.newPost;
                    let postTitle = form.posttitle.value;
                    let postContent = form.postcontent.value;                    
                    presenter.saveNewPost(postTitle, postContent);
                } else if (action === "cancel" && confirm("Wollen Sie die den Entwurf wirklich verwerfen?")) {
                    router.navigateToPage('/blogOverview/' + blogId);
                }
            }
        }

        let page = document.getElementById("postNew").cloneNode(true);
        page.removeAttribute('id');

        page.innerHTML = page.innerHTML.replace("%blogId", blogId);
        page.addEventListener("click", handleActionButtons);
        return page;
    }
};

const editPost = {

    render(post) {

        function handleActionButtons(event) {
            let source = event.target;
            if (source) {
                let action = source.dataset.action;
                if (action === "saveEditPost" && confirm('Wollen Sie die den Post wirklich speichern?')) {
                    event.preventDefault();
                    let form = document.forms.editPost;
                    let postTitle = form.posttitle.value;
                    let postContent = document.getElementById('editedPostContent').innerHTML;
                    presenter.saveEditPost(action, postTitle, postContent);
                } else if (action === "cancel" && confirm("Wollen Sie die den Entwurf wirklich verwerfen?")) {
                    presenter.saveEditPost(action, null, null);
                }

            }
        }

        let page = document.getElementById("postEdit").cloneNode(true);
        page.removeAttribute("id");

        post.setFormatDates(true);
        helper.setDataInfo(page, post);
        page.addEventListener("click", handleActionButtons);
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
    },
    
    setNavButtons(templ) {
        let buttons = document.getElementById("buttons").cloneNode(true);
        buttons.removeAttribute("id");
        let nav = templ.querySelector("nav");
        nav.append(buttons);
    }
};
