const app = new Vue({
    el: '#container',
    data: {
        drops: [],
        dropCount: 0,
        exportedJson: "",
        importedJson: ""
    },
    methods: {

        /** Get a drop from its id */
        getDropById: function(dropId) {
            return app.drops.find(function(element) {
                return element.id === dropId;
            });
        },
        /** Get a state from its id */
        getStateById: function(dropId, stateId) {
            var drop = app.getDropById(dropId);
            return drop.states.find(function(element) {
                return element.id === stateId;
            });
        },


        /** Add a drop to the configuration */
        addDrop: function() {
            app.dropCount++;
            app.drops.push(
                {'id': app.dropCount, 'stateCount': 0, 'states': []}
            );
            window.onbeforeunload = function(){
                return 'Are you sure you want to leave ?';
            };
            app.$forceUpdate();
            setTimeout(function() {
                $('#drop-' + app.dropCount).collapse();
            });
        },
        /** Remove a drop from the configuration */
        removeDrop: function(dropId) {
            var drop = app.getDropById(dropId);
            app.drops.splice(app.drops.indexOf(drop), 1);
            if (app.drops.length === 0) {
                window.onbeforeunload = null;
            }
            app.$forceUpdate();
        },
        /** Add a block state to the configured drop */
        addState: function(dropId) {
            var drop = app.getDropById(dropId);
            drop.stateCount++;
            var stateName = $("#drop-" + dropId + "-state-name").val();
            var stateValue = $("#drop-" + dropId + "-state-value").val();
            drop.states.push(
                {'id': drop.stateCount, 'name': stateName, 'value': stateValue}
            );
            app.$forceUpdate();
        },
        /** Remove a block state from the configured drop */
        removeState: function(dropId, stateId) {
            var drop = app.getDropById(dropId);
            var state = app.getStateById(dropId, stateId);
            drop.states.splice(drop.states.indexOf(state), 1);
            app.$forceUpdate();
        }
    }
});
