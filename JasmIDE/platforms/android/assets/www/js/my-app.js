var myApp = new Framework7({
    material: true,
    materialRipple: true
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$('#menu-btns > li > a').on('click', function(){
    myApp.closePanel();
});

myApp.onPageInit("settings", function(page){
    ;
});

var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        myApp.alert('Received event: '+id);
    }
}

app.initialize();