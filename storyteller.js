const app = new Vue({
    el: '.container',
    data: {
        dialogs: [],
        dialogCount: 0,
        exportedJson: "",
        importedJson: ""
    },
    methods: {

        /** Get a dialog from its id */
        getDialogById: function(dialogId) {
            return app.dialogs.find(function(element) {
                return element.id === dialogId;
            });
        },
        /** Get a page from its id and its parent id */
        getPageById: function(dialogId, pageId) {
            var dialog = app.getDialogById(dialogId);
            return dialog.pages.find(function(element) {
                return element.id === pageId;
            });
        },
        /** Get a button from its id and its parents id */
        getButtonById: function(dialogId, pageId, buttonId) {
            var page = app.getPageById(dialogId, pageId);
            return page.buttons.find(function(element) {
                return element.id === buttonId;
            });
        },
        /** Get a button action from its id and its parents id */
        getActionById: function(dialogId, pageId, buttonId, actionId) {
            var button = app.getButtonById(dialogId, pageId, buttonId);
            return button.actions.find(function(element) {
                return element.id === actionId;
            });
        },


        /** Add a dialog to the configuration */
        addDialog: function() {
            app.dialogCount++;
            app.dialogs.push(
                {'id': app.dialogCount, 'pageCount': 0, 'name': '', 'trigger': '', 'item': '', 'objective': ''}
            );
            window.onbeforeunload = function(){
                return 'Are you sure you want to leave ?';
            };
            app.$forceUpdate();
            setTimeout(function() {
                $('#dialog-' + app.dialogCount).collapse();
            });
            $(".tagsfiled").select2(
                {tags : true}
            );
        },
        /** Remove a dialog from the configuration */
        removeDialog: function(dialogId) {
            var dialog = app.getDialogById(dialogId);
            app.dialogs.splice(app.dialogs.indexOf(dialog), 1);
            if (app.dialogs.length === 0) {
                window.onbeforeunload = null;
            }
            app.$forceUpdate();
        },

        /** Add a page to the dialog */
        addPage: function(dialogId) {
            var dialog = app.getDialogById(dialogId);
            if (!dialog.pages || dialog.pages.length == 0) {
                Vue.set(dialog, 'pages', []);
            }
            dialog.pageCount++;
            dialog.pages.push({'id': dialog.pageCount, 'buttonCount': 0, 'text': ''});
            app.$forceUpdate();
            // Tab switch not working dynamically ! Didn't the tab appear yet ?
            setTimeout(function() {
                $('#dialog-' + dialog.id + '-page-' + dialog.pageCount + '-link').tab('show');
            });
        },
        /** Remove a page from the dialog */
        removePage: function(dialogId, pageId) {
            var dialog = app.getDialogById(dialogId);
            var page = app.getPageById(dialogId, pageId);
            dialog.pages.splice(dialog.pages.indexOf(page), 1);
            app.$forceUpdate();
        },

        /** Add a button from the page */
        addButton: function(dialogId, pageId) {
            var page = app.getPageById(dialogId, pageId);
            if (!page.buttons || page.buttons.length == 0) {
                Vue.set(page, 'buttons', []);
            }
            page.buttonCount++;
            page.buttons.push({'id': page.buttonCount, 'text': ''});
            app.$forceUpdate();
            // Button collapse not working right after added. Seems to be the same problem as for the tab.
            $('#page-' + pageId + '-button-' + page.buttonCount + '-collapse').collapse();
        },
        /** Remove a button from the page */
        removeButton: function(dialogId, pageId, buttonId) {
            var page = app.getPageById(dialogId, pageId);
            var button = app.getButtonById(dialogId, pageId, buttonId);
            page.buttons.splice(page.buttons.indexOf(button), 1);
            app.$forceUpdate();
        },

        /** Add an action to the button */
        addAction: function(dialogId, pageId, buttonId) {
            var button = app.getButtonById(dialogId, pageId, buttonId);
            if (!button.actions) {
                button.actions = [];
                button.actionCount = 0;
            }
            button.actionCount++;
            button.actions.push(
                {'id': button.actionCount, 'type': button.newActionType, 'arguments': button.newActionArguments}
            );
            app.$forceUpdate();
        },
        /** Remove an action from the button */
        removeAction: function(dialogId, pageId, buttonId, actionId) {
            var button = app.getButtonById(dialogId, pageId, buttonId);
            var action = app.getActionById(dialogId, pageId, buttonId, actionId);
            button.actions.splice(button.actions.indexOf(action), 1);
            app.$forceUpdate();
        },


        /** Convert the dialogs data into JSON object */
        exportDialogs: function() {
            var json = {};
            for (var dialogId in app.dialogs) {
                var dialog = app.dialogs[dialogId];
                var dialogName = dialog.name;
                json[dialogName] = {};
                json[dialogName].trigger = dialog.trigger;
                json[dialogName].objective = dialog.objective;
                json[dialogName].items = dialog.item;
                json[dialogName].pages = app.exportPages(dialog.pages);
            }
            return json
        },
        /** Convert the pages data into JSON ready object */
        exportPages: function(pages) {
            var json = [];
            var i = 0;
            for (var pageId in pages) {
                var page = pages[pageId];
                json[i] = {};
                json[i].text = page.text;
                json[i].buttons = app.exportButtons(page.buttons);
                i++;
            }
            return json;
        },
        /** Convert the buttons data into JSON ready object */
        exportButtons: function(buttons) {
            var json = [];
            var i = 0;
            for (var buttonId in buttons) {
                var button = buttons[buttonId];
                json[i] = {};
                json[i].text = button.text;
                if (button.actions && button.actions.length > 0) {
                    json[i].actions = app.exportActions(button.actions);
                }
                i++;
            }
            return json;
        },
        /** Convert the actions data into JSON ready object */
        exportActions: function(actions) {
            var json = [];
            var i = 0;
            for (var actionId in actions) {
                var action = actions[actionId];
                json[i] = action.type + ' ' + action.arguments;
                i++;
            }
            return json;
        },

        /** Convert the JSON object into dialogs data */
        importDialogs: function(dialogs) {
            var newData = [];
            var i = 0;
            for (var dialogId in dialogs) {
                var dialog = dialogs[dialogId];
                newData[i] = {};
                newData[i].id = i+1;
                newData[i].name = dialogId;
                newData[i].trigger = dialog.trigger;
                newData[i].objective = dialog.objective;
                newData[i].item = dialog.items;
                newData[i].pages = app.importPages(dialog.pages);
                newData[i].pageCount = newData[i].pages.length;
                i++;
            }
            return newData;
        },
        /** Convert the pages part of the JSON object into pages data */
        importPages: function(pages) {
            var newData = [];
            var i = 0;
            for (var pageId in pages) {
                var page = pages[pageId];
                newData[i] = {};
                newData[i].id = i+1;
                newData[i].text = page.text;
                newData[i].buttons = app.importButtons(page.buttons);
                newData[i].buttonCount = newData[i].buttons.length;
                i++;
            }
            return newData;
        },
        /** Convert the buttons part of the JSON object into buttons data */
        importButtons: function(buttons) {
            var newData = [];
            var i = 0;
            for (var buttonId in buttons) {
                var button = buttons[buttonId];
                newData[i] = {};
                newData[i].id = i+1;
                newData[i].text = button.text;
                newData[i].actions = app.importActions(button.actions);
                newData[i].actionCount = newData[i].actions.length;
                i++;
            }
            return newData;
        },
        /** Convert the actions part of the JSON object into actions data */
        importActions: function(actions) {
            var newData = [];
            var i = 0;
            for (var actionId in actions) {
                var action = actions[actionId];
                newData[i] = {};
                newData[i].type = action.substring(0, action.indexOf(' ')+1)
                newData[i].arguments = action.substring(action.indexOf(' ')+1);
                i++;
            }
            return newData;
        },


        /** Update the exported JSON to match the content of the page */
        updateJson: function() {
            app.exportedJson = JSON.stringify(app.exportDialogs(), null, 4);
        },
        /** Update the imported JSON/HOCON to match the content of the file */
        importFile: function(event) {
            if (event.target.files.length == 0) {
                return;
            }
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(e) {
                    app.importedJson = e.target.result;
                    $('.import-modal').modal('show');
                }
            })(file);
            reader.readAsBinaryString(file);
        },
        /** Try to convert the content that has already been loaded into JSON */
        convertFileContent: function(event) {
            var importedObject = JSON.parse(app.importedJson)
            var importedData = app.importDialogs(importedObject);
            app.dialogCount = importedData.length;
            app.dialogs = importedData;
            $('.modal').modal('hide');
        }

    }
});

$(function() {
    $('#trigger').select2({
        tags : true,
        tokenSeparators: [',', ' '],
    });

    document.getElementById('importFile').addEventListener('change', app.importFile, false);
});
