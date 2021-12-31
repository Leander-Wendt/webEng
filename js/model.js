/* 
 * 
 /*
 * Adresse über die man auf die Webschnittstelle meines Blogs zugreifen kann:
 */
"use strict";

const model = (function () {
    // Private Variablen
    let loggedIn = false;
    let items = new Array();

    let pathGetBlogs = 'blogger/v3/users/self/blogs';
    let pathBlogs = 'blogger/v3/blogs';

    function Blog(id, blogname, amountPosts, dateCreated, dateEdited, url) {
        this.id = id;
        this.blogname = blogname;
        this.amountPosts = amountPosts;
        this.dateCreatedRaw = dateCreated;
        this.dateEditedRaw = dateEdited;
        this.url = url;
    }

    Blog.prototype = {
        constructor: Blog,
        setFormatDates: function(longCreated, longEdited){
            this.dateCreated = formatDate(dateCreatedRaw, longCreated);
            this.dateEdited = formatDate(dateEditedRaw, longEdited);
        }
    }

    function Post(id, blogId, posttitel, dateCreated, dateEdited, content, amountComments) {
        this.id = id;
        this.blogId = blogId;
        this.posttitel = posttitel;
        this.dateCreatedRaw = dateCreated;
        this.dateEditedRaw = dateEdited;
        this.content = content;
        this.amountComments = amountComments;
    }

    Post.prototype = {
        constructor: Post,
        setFormatDates: function(LongCreated, LongEdited){
            this.dateCreated = formatDate(dateCreatedRaw, LongCreated);
            this.dateEdited = formatDate(dateEditedRaw, LongEdited);
        }
    }

    function Comment(id, blogId, postId, author, dateCreated, dateEdited, content) {
        this.id = id;
        this.blogId = blogId;
        this.postId = postId;
        this.createdBy = author;
        this.dateCreatedRaw = dateCreated;
        this.dateEditedRaw = dateEdited;
        this.content = content;
    }

    Comment.prototype = {
        constructor: Comment,
        setFormatDates: function(longCreated, longEdited){
            this.dateCreated = formatDate(dateCreatedRaw, longCreated);
            this.dateEdited = formatDate(dateEditedRaw, longEdited);
        }
    }

    items.push("Test");
    
    // Private Funktionen 

    // Formatiert den Datum-String in date in zwei mögliche Datum-Strings: 
    // long = false: 24.10.2018
    // long = true: Mittwoch, 24. Oktober 2018, 12:21
    // Format: YYYY-MM-DDTHH:MM:SS-Timezone
    function formatDate(date, long) {       
        if (!long){
            let day = date.getDate();
            let month = date.getMonth();
            if (day < 10) {
                day = "0" + day; 
            }
            if (month < 10) {
                month = "0" + month; 
            }              
            return day + "." + month + "." + (date.getYear() + 1900); 
        }        
        let weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];  
        //                                                                                                                               + entspricht GMT + n       
        return weekdays[date.getDay()] + ", " + date.getDate() + ". " + months[date.getMonth()] + " " + (date.getYear() + 1900) + ", " + (date.getHours() + 2) + ":" + date.getMinutes(); 
    }
    
    // Konstruktoren für Daten-Objekte
    

    // Oeffentliche Methoden
    return {
        // Setter für loggedIn
        setLoggedIn(b){
            loggedIn = b;
        },
        // Getter für loggedIn
        isLoggedIn(){
            return loggedIn;
        },
        // Liefert den angemeldeten Nutzer mit allen Infos
        getSelf(callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': 'blogger/v3/users/self'
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result);
            });
        },

        // Liefert alle Blogs des angemeldeten Nutzers
        getAllBlogs(callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathGetBlogs
            });
            // Execute the API request.
            request.execute((result) => {
                let blogs = [];
                
                for(let obj of result.items){
                    let blog = new Blog(obj.id, obj.name, obj.posts.totalItems, obj.published, obj.updated, obj.url);
                    blogs.push(blog);
                }
                
                callback(blogs);
            });
        },

        // Liefert den Blog mit der Blog-Id bid
        getBlog(bid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid
            });
            // Execute the API request.
            request.execute((result) => {
                callback(new Blog(result.id, result.name, result.posts.totalItems, result.published, result.updated, result.url));
            });
        },

        // Liefert alle Posts zu der Blog-Id bid
        getAllPostsOfBlog(bid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + '/posts'
            });

            request.execute((result) => {
                let posts = [];
                
                for(let obj of result.items){
                    let post = new Post(obj.id, obj.blog.id, obj.title, obj.published, obj.updated, obj.content, obj.replies.totalItems);
                    posts.push(post);
                }
                
                callback(posts);
            });
        },

        // Liefert den Post mit der Post-Id pid im Blog mit der Blog-Id bid
        getPost(bid, pid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + '/posts/' + pid
            });

            request.execute((result) => {
                callback(new Post(result.id, result.blog.id, result.title, result.published, result.updated, result.content, result.replies.totalItems));
            });
        },

        // Liefert alle Kommentare zu dem Post mit der Post-Id pid 
        // im Blog mit der Blog-Id bid
        getAllCommentsOfPost(bid, pid, callback) {
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + '/posts/' + pid + "/comments"
            });

            request.execute((result) => {
                let comments = [];
                
                for(let obj of result.items){
                    let comment = new Comment(obj.id, obj.blog.id, obj.post.id, obj.author, obj.published, obj.updated, obj.content);
                    comments.push(comment);
                }
                
                callback(comments);
            });
        },

        // Löscht den Kommentar mit der Id cid zu Post mit der Post-Id pid 
        // im Blog mit der Blog-Id bid 
        // Callback wird ohne result aufgerufen
        deleteComment(bid, pid, cid, callback) {
            var path = pathBlogs + "/" + bid + '/posts/' + pid + "/comments/" + cid;
            console.log(path);
            var request = gapi.client.request({
                'method': 'DELETE',
                'path': path
            });

            request.execute(callback);
        },

        // Fügt dem Blog mit der Blog-Id bid einen neuen Post 
        // mit title und content hinzu, Callback wird mit neuem Post aufgerufen
        addNewPost(bid, title, content, callback) {
            var body = {
                kind: "blogger#post",
                title: title,
                blog: {
                    id: bid
                },
                content: content
            };

            var request = gapi.client.request({
                'method': 'POST',
                'path': pathBlogs + "/" + bid + '/posts',
                'body': body
            });

            request.execute(callback);
        },

        // Aktualisiert title und content im geänderten Post 
        // mit der Post-Id pid im Blog mit der Blog-Id bid
        updatePost(bid, pid, title, content, callback) {
            var body = {
                kind: "blogger#post",
                title: title,
                id: pid,
                blog: {
                    id: bid
                },
                content: content
            };

            var request = gapi.client.request({
                'method': 'PUT',
                'path': pathBlogs + "/" + bid + '/posts/' + pid,
                'body': body
            });

            request.execute(callback);
        },

        // Löscht den Post mit der Post-Id pid im Blog mit der Blog-Id bid, 
        // Callback wird ohne result aufgerufen
        deletePost(bid, pid, callback) {
            var path = pathBlogs + "/" + bid + '/posts/' + pid;
            console.log(path);
            var request = gapi.client.request({
                'method': 'DELETE',
                'path': path
            });

            request.execute(callback);
        }
    };
})();



