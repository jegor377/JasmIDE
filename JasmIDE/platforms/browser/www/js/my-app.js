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
        console.log(cordova.file);
        app.setProject();
        app.setProgramCallbacks();
        window.addEventListener('filePluginIsReady', function(){ console.log('File plugin is ready');}, false);
    },

    setProject: function() {
        project = {
            wasSaved: false,
            projectPath: null,
            settings: {
                autosave: {
                    isSet: false,
                    delay: 0
                },
                font: {
                    fontFamily: 'Courier New',
                    supplyFonts: ', Courier, Lucida Sans Typewriter',
                    fontSize: 20
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
            if(!project.wasSaved) {
                myApp.modal({
                    title: 'Warning!',
                    text: "You didn't save your project. Do you want to save?",
                    buttons: [
                        {
                            text: 'Yes',
                            onClick: function() {
                                app.saveProject();
                                $$('#code').val("");
                            }
                        },
                        {
                            text: 'No',
                            onClick: function() {
                                $$('#code').val("");
                            }
                        }
                    ]
                });
            }
        });

        $$('#code').on('change', function(){
            project.wasSaved = false;
        });

        $$('#save-file').on('click', function(){
            app.saveProject();
        });

        $$('#load-file').on('click', function(){
            fileChooser.open(function(uri) {
                var path = "file://"+uri.filepath;
                if(uri.filepath != "") {
                    pathEntries = path.split('/');
                    project.projectPath = pathEntries[pathEntries.length-1].split('.')[0];
                }

                gotFile = function(fileEntry){
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            var content = this.result;
                            $$('#code').val(content);
                            project.wasSaved = true;
                        };
                        reader.readAsText(file);
                    });
                };

                fail = function(error){
                    alert("Cannot to load file.");
                };

                window.resolveLocalFileSystemURL(path, gotFile, fail);
            }, function(error){
                alert("Cannot to load file.");
            });
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

            $$('#font-size').on('change', function(e){
                project.settings.font.fontSize =  $$('#font-size').val();
                app.setSettingsOptionsTestFontSize();
            });

            $$('#change-font').on('click', function(e){
                var buttons = [
                    {
                        text: 'Fonts:',
                        label: true,
                        bold: true
                    },
                    {
                        text: 'Arial',
                        onClick: function() {
                            project.settings.font.fontFamily = 'Arial';
                            app.setSettingsTestFont();
                        }
                    },
                    {
                        text: 'Courier New',
                        onClick: function() {
                            project.settings.font.fontFamily = 'Courier New';
                            app.setSettingsTestFont();
                        }
                    },
                    {
                        text: 'Tahoma',
                        onClick: function() {
                            project.settings.font.fontFamily = 'Tahoma';
                            app.setSettingsTestFont();
                        }
                    },
                    {
                        text: 'Times New Roman',
                        onClick: function() {
                            project.settings.font.fontFamily = 'Times New Roman';
                            app.setSettingsTestFont();
                        }
                    }
                ];
                myApp.actions(buttons);
            });
        });

        myApp.onPageBack('settings', function(page){
            app.setCodeSettings();
        });
    },

    setSettingsOptions: function(){
        app.setAutosaveInput();
        app.showAutosaveDelay();
        app.setAutosaveBtnDisableVal();
        app.setSettingsTestFont();
        app.setSettingsOptionsTestFontSize();
        app.setSettingsSliderValForFontSize();
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
    },

    setSettingsSliderValForFontSize: function() {
        $$('#font-size').val(project.settings.font.fontSize);
    },

    setSettingsTestFont: function() {
        $$('#font-test').css('font-family', project.settings.font.fontFamily + project.settings.font.supplyFonts);
    },

    setSettingsOptionsTestFontSize: function() {
        $$('#font-test').css('font-size', project.settings.font.fontSize + 'px');
    },

    setCodeFont: function() {
        $$('#code').css('font-family', project.settings.font.fontFamily + project.settings.font.supplyFonts);
    },

    setCodeFontSize: function() {
        $$('#code').css('font-size', project.settings.font.fontSize + 'px');
    },

    setCodeSettings: function() {
        app.setCodeFont();
        app.setCodeFontSize();
    },

    askForProjectName: function() {
        if(project.projectPath == null){
            myApp.prompt('Type project name:', 'Project Name', function(value){
                if(value.length == 0)
                {
                    myApp.alert("You didn't type project name!");
                    app.askForProjectName();
                } else {
                    project.projectPath = value.replace('\\', '').replace('/', '').replace('.', '');
                    myApp.alert("You need to click save button again.");
                }
            });
        }
    },

    saveProject: function() {
        if(project.projectPath != null) {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileSystem){
                fileSystem.getDirectory("JASMIDE", {create: true, exclusive: false}, function(dirEntry){
                    dirEntry.getFile(project.projectPath+".asm", {create: true, exclusive: false}, function(fileEntry){
                        fileEntry.createWriter(function(fileWriter){
                            container = $$('body');
                            if (container.children('.progressbar, .progressbar-infinite').length) {
                                myApp.hideProgressbar(container);
                            }
                            myApp.showProgressbar(container, 0, "green");
                            fileWriter.onprogress = function(progressEvent) {
                                container = $$('body');
                                myApp.setProgressbar(container, progressEvent.loaded / progressEvent.total);
                            };

                            fileWriter.onwriteend = function(evt) {
                                container = $$('body');
                                myApp.hideProgressbar(container);
                                myApp.addNotification({
                                    message: 'File saved'
                                });
                                project.wasSaved = true;
                            };

                            data = $$('#code').val();
                            fileWriter.write(data);
                        }, function(error){
                            myApp.alert("Cannot to save file.");
                        });
                    }, function(error){
                        myApp.alert("Cannot to save file.");
                    });
                }, function(error){
                    myApp.alert("Cannot to save file.");
                });
            }, function(error){
                myApp.alert("Cannot to save file.");
            });
        } else app.askForProjectName();
    }
};

app.initialize();