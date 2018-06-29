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

        getDialogById: function(dialogId) {
            return app.dialogs.find(function(element) {
                return element.id === dialogId;
            });
        },
        getPageById: function(dialogId, pageId) {
            var dialog = app.getDialogById(dialogId);
            return dialog.pages.find(function(element) {
                return element.id === pageId;
            });
        },
        getButtonById: function(dialogId, pageId, buttonId) {
            var page = app.getPageById(dialogId, pageId);
            return page.buttons.find(function(element) {
                return element.id === buttonId;
            });
        },
        getActionById: function(dialogId, pageId, buttonId, actionId) {
            var button = app.getButtonById(dialogId, pageId, buttonId);
            return button.actions.find(function(element) {
                return element.id === actionId;
            });
        },

        addDialog: function() {
            app.dialogCount++;
            app.dialogs.push(
                {'id': app.dialogCount, 'pageCount': 0, 'name': '', 'trigger': '', 'item': '', 'objective': ''}
            );
            this.$forceUpdate();
        },
        removeDialog: function(dialogId) {
            var dialog = app.getDialogById(dialogId);
            app.dialogs.splice(app.dialogs.indexOf(dialog), 1);
            this.$forceUpdate();
        },

        addPage: function(dialogId) {
            var dialog = app.getDialogById(dialogId);
            if (!dialog.pages || dialog.pages.length == 0) {
                Vue.set(dialog, 'pages', []);
            }
            dialog.pageCount++;
            dialog.pages.push({'id': dialog.pageCount, 'buttonCount': 0, 'text': ''});
            this.$forceUpdate();
            // Tab switch not working dynamically ! Didn't the tab appear yet ?
            $('#page-' + app.dialog + '-link').tab('show');
        },
        removePage: function(dialogId, pageId) {
            var dialog = app.getDialogById(dialogId);
            var page = app.getPageById(dialogId, pageId);
            dialog.pages.splice(dialog.pages.indexOf(page), 1);
            this.$forceUpdate();
        },

        addButton: function(dialogId, pageId) {
            var page = app.getPageById(dialogId, pageId);
            if (!page.buttons || page.buttons.length == 0) {
                Vue.set(page, 'buttons', []);
            }
            page.buttonCount++;
            page.buttons.push({'id': page.buttonCount, 'text': ''});
            this.$forceUpdate();
            // Button collapse not working right after added. Seems to be the same problem as for the tab.
            $('#page-' + pageId + '-button-' + page.buttonCount + '-collapse').collapse();
        },
        removeButton: function(dialogId, pageId, buttonId) {
            var page = app.getPageById(dialogId, pageId);
            var button = app.getButtonById(dialogId, pageId, buttonId);
            page.buttons.splice(page.buttons.indexOf(button), 1);
            this.$forceUpdate();
        },

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
            this.$forceUpdate();
        },
        removeAction: function(dialogId, pageId, buttonId, actionId) {
            var button = app.getButtonById(dialogId, pageId, buttonId);
            var action = app.getActionById(dialogId, pageId, buttonId, actionId);
            button.actions.splice(button.actions.indexOf(action), 1);
            this.$forceUpdate();
        }

    }
});
