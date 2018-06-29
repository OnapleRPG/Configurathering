$(function() {
    $('#trigger').tokenfield();
});

const app = new Vue({
    el: '.container',
    data: {
        dialogs: [],
        dialogCount: 0
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
        },
        /** Remove a dialog from the configuration */
        removeDialog: function(dialogId) {
            var dialog = app.getDialogById(dialogId);
            app.dialogs.splice(app.dialogs.indexOf(dialog), 1);
            if (app.dialogs.length === 0) {
                window.onbeforeunload = null;
            }
        },

        /** Add a page to the dialog */
        addPage: function(dialogId) {
            var dialog = app.getDialogById(dialogId);
            if (!dialog.pages || dialog.pages.length == 0) {
                Vue.set(dialog, 'pages', []);
            }
            dialog.pageCount++;
            dialog.pages.push({'id': dialog.pageCount, 'buttonCount': 0, 'text': ''});
            // Tab switch not working dynamically ! Didn't the tab appear yet ?
            $('#page-' + app.dialog + '-link').tab('show');
        },
        /** Remove a page from the dialog */
        removePage: function(dialogId, pageId) {
            var dialog = app.getDialogById(dialogId);
            var page = app.getPageById(dialogId, pageId);
            dialog.pages.splice(dialog.pages.indexOf(page), 1);
        },

        /** Add a button from the page */
        addButton: function(dialogId, pageId) {
            var page = app.getPageById(dialogId, pageId);
            if (!page.buttons || page.buttons.length == 0) {
                Vue.set(page, 'buttons', []);
            }
            page.buttonCount++;
            page.buttons.push({'id': page.buttonCount, 'text': ''});
            // Button collapse not working right after added. Seems to be the same problem as for the tab.
            $('#page-' + pageId + '-button-' + page.buttonCount + '-collapse').collapse();
        },
        /** Remove a button from the page */
        removeButton: function(dialogId, pageId, buttonId) {
            var page = app.getPageById(dialogId, pageId);
            var button = app.getButtonById(dialogId, pageId, buttonId);
            page.buttons.splice(page.buttons.indexOf(button), 1);
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
        },
        /** Remove an action from the button */
        removeAction: function(dialogId, pageId, buttonId, actionId) {
            var button = app.getButtonById(dialogId, pageId, buttonId);
            var action = app.getActionById(dialogId, pageId, buttonId, actionId);
            button.actions.splice(button.actions.indexOf(action), 1);
        },


        /** Convert the JS data into JSON object */
        exportToJson: function() {
            var json = {};
            for (var dialogId in app.dialogs) {
                var dialog = app.dialogs[dialogId];
                var dialogName = dialog.name;
                json[dialogName] = {};
                json[dialogName].trigger = dialog.trigger;
                json[dialogName].objective = dialog.objective;
                json[dialogName].items = dialog.item;
                json[dialogName].pages = [];
                for (page in dialog.pages) {
                    json[dialogName].pages[json[dialogName].pages.length] = {};
                }
            }
            return JSON.stringify(json);
        }

    }
});
