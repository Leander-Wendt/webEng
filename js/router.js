/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

const router = (function () {
    // Private Variable
    let mapRouteToHandler = new Map();

    // Oeffentliche Methoden
    return {
        // Fügt eine neue Route (URL, auszuführende Funktion) zu der Map hinzu
        addRoute: function (route, handler) {
            mapRouteToHandler.set(route, handler);
        },

        // Wird aufgerufen, wenn zu einer anderen Adresse navigiert werden soll
        navigateToPage(url) {
            history.pushState(null, "", url);
            this.handleRouting();
        },

        // Wird als Eventhandler an ein <a>-Element gebunden
        handleNavigationEvent: function (event) {
            event.preventDefault();
            let url = event.target.href;
            this.navigateToPage(url);
        },

        // Wird als EventHandler aufgerufen, sobald die Pfeiltasten des Browsers betätigt werden
        handleRouting: function () {
            console.log("Aufruf von router.handleRouting(): Navigation zu: " + window.location.pathname);
            const currentPage = window.location.pathname.split('/')[1];
            let routeHandler = mapRouteToHandler.get(currentPage);
            if (routeHandler === undefined)
                routeHandler = mapRouteToHandler.get(''); //Startseite
            routeHandler(window.location.pathname);
        }
    };
})();

// Selbsaufrufende Funktionsdeklaration: (function name(){..})();
(function initRouter() {
    // The "Homepage". localhost:8888
    router.addRoute('', function () {
        presenter.showStartPage();
    });
    
    router.addRoute('blogOverview', function (url) {
        let bid = url.split('/blogOverview/')[1].trim();
        presenter.showBlogOverview(bid);
    });
    
    router.addRoute('postDetail', function (url) {
        let bid = url.split('/')[2].trim();
        let pid = url.split('/')[3].trim();
        presenter.showPostDetailView(bid, pid);
    });
    
    // Editor für Hinzufuegen von Person: localhost:8888/add
    router.addRoute('add', function () {
        presenter.showAdd();
    });
    
    // Editor für Person: Bsp. localhost:8888/edit/2
    router.addRoute('edit', function () {
        // Aus dem location.hash die Objekt id lesen
        let id = window.location.pathname.split('/edit/')[1].trim();

        presenter.showEdit(id);
    });
    
    if (window) {
        window.addEventListener('popstate', (event) => {
            router.handleRouting();
        });
        router.handleRouting();
    }
})();


