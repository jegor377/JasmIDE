var myApp = new Framework7({
    material: true,
    materialRipple: true
});
var $$ = Dom7;
var app = null;
var project = null;
var settings = null;

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
            projectPath: null,
            settings: {
                autosave: {
                    isSet: false,
                    delay: 0
                }
            }
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
            app.setSettingsOptions();

            $$('#autosave').on('change', function(e){
                project.settings.autosave.isSet = $$('#autosave').prop('checked');
                app.setAutosaveBtnDisableVal();
            });

            $$('#autosave-delay-button').on('click', function(e){
                myApp.prompt('Type the time (in minutes) after which app has to save data.', 'Autosave Delay', function (value) {
                    if(app.isNumber(value)) project.settings.autosave.delay = value;
                    else myApp.alert('The value is not a number!', 'Error');
                    app.setSettingsOptions();
                });
            });
        });
    },

    setSettingsOptions: function(){
        app.setAutosaveInput();
        app.showAutosaveDelay();
        app.setAutosaveBtnDisableVal();
    },

    showAutosaveDelay: function(){
        $$('#autosave-delay').html(project.settings.autosave.delay);
    },

    setAutosaveBtnDisableVal: function(){
        if(!project.settings.autosave.isSet) $$('#autosave-delay-button').addClass('disabled');
        else $$('#autosave-delay-button').removeClass('disabled');
    },

    setAutosaveInput: function(){
        $$('#autosave').prop('checked', project.settings.autosave.isSet);
    },

    isNumber: function(val) {
        var comparableStr = val.toString();
        for(var i in comparableStr) {
            if(comparableStr.charAt(i) < '0' || comparableStr.charAt(i) > '9') return false;
        }
        return true;
    }
};

app.initialize();