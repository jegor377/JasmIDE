var myApp = new Framework7({
    material: true,
    materialRipple: true
});
var $$ = Dom7;
var app = null;
var project = null;

app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.setProject();
        app.setProgramCallbacks();
    },

    setProject: function() {
        project = {
            wasSaved: false,
            projectPath: null
        };
    },

    setProgramCallbacks: function() {
        var mainView = myApp.addView('.view-main', {
            dynamicNavbar: true
        });

        $$('#menu-btns > li > a').on('click', function(){
            myApp.closePanel();
        });

        $$('.create-new-file').on('click', function(){
            if(project.wasSaved) {
                myApp.modal({
                    title: 'Warning!',
                    text: "You didn't save your project. Do you want to save?",
                    buttons: [
                        {
                            text: 'Yes',
                            onClick: function() {
                                myApp.alert("You choosed save option.");
                            }
                        },
                        {
                            text: 'No',
                            onClick: function() {
                                myApp.alert("You choosed not save option");
                            }
                        }
                    ]
                });
            }
        });

        myApp.onPageInit("settings", function(page){
            ;
        });
    }
};

app.initialize();