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

        myApp.onPageInit('save', function(page){
            app.createFile("test.txt", "TEST FILE", "show-directory-folders");
            app.readFile("test.txt", "show-directory-folders");
            app.readDirectoryEntries("show-directory-folders");
            //app.testLoadDir("show-directory-folders");
            

            $$('.click-me').on('click', function(){app.testFileChooser("show-directory-folders"); myApp.alert("You clicked it");});
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

    readDirectoryEntries: function(id) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
            dirReader = fs.root.createReader();

            dirReader.readEntries(function(res){
                if(res.length != 0) {
                    for(var index in res)
                    {
                        console.log(res[index]);
                        var node = document.createElement("LI");
                        var nodeEntry = document.createTextNode(res[index].name);
                        node.appendChild(nodeEntry);
                        document.getElementById(id).appendChild(node);
                    }
                }
            }, app.fileSystemError);

        }, app.fileSystemError);
    },

    createFile: function(path, text, id){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
            fs.root.getFile(path, {create: true, exclusive: false}, function(fe){
                fe.createWriter(function(fw){
                    fw.onwriteend = function() {
                        console.log("The file has been saved correctly!");
                        var node = document.createElement("LI");
                        var nodeEntry = document.createTextNode("The file has been saved correctly!");
                        node.appendChild(nodeEntry);
                        document.getElementById(id).appendChild(node);
                    };

                    fw.write(text);
                }, app.fileSystemError);
            }, app.fileSystemError);
        }, app.fileSystemError);
    },

    readFile: function(path, id){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
            fs.root.getFile(path, null, function(fe){
                fe.file(function(file){
                    reader = new FileReader();

                    reader.onloadend = function(data){
                        text = data.target.result;
                        console.log("File Readed Correctly : "+text);
                        var node = document.createElement("LI");
                        var nodeEntry = document.createTextNode(text);
                        node.appendChild(nodeEntry);
                        document.getElementById(id).appendChild(node);
                    };

                    reader.readAsText(file);

                }, app.fileSystemError);
            }, app.fileSystemError);
        }, app.fileSystemError);
    },

    testLoadDir: function(id) {
        errorHandler = function( error ) {
            alert( error.error );
        };
        successHandler = function( fileEntry ) {
            alert( fileEntry.name + " | " + fileEntry.fullPath );
        };
        new ExternalStorageSdcardAccess( successHandler, errorHandler ).scanPath( "file:///" );
    },

    testFileChooser: function(id) {
        fileChooser.open(function(uri) {
            alert("KURWA DZIAŁA! "+uri);
        }, function(error){
            alert("Chuja tam działa... ;-; "+error.message);
        });
        // success = function(data){
        //     alert("SUKCES KURWA! "+data.filepath);
        //     app.readFile(data.filepath, "show-directory-folders");
        // };

        // error = function(error){
        //     alert("Chuja nie sukces... ;-; "+error);
        // };
        
        // filechooser.open({},success,error);
    },

    fileSystemError: function(error) {
        myApp.alert("FILE SYSTEM ERROR : "+error.message);
        console.log(error);
    }
};

app.initialize();