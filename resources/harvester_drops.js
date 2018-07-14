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
        },

        /** Format exported JSON */
        exportJson: function() {
            var formattedDrops = $.map(app.drops, function(drop) {
                var formattedDrop = {};
                formattedDrop.type = drop.type;
                if (drop.states.length > 0) {
                    formattedDrop.state = {};
                }
                for(var state in drop.states) {
                    formattedDrop.state[drop.states[state].name] = drop.states[state].value;
                }
                if (drop.itemName) {
                    formattedDrop.item_name = drop.itemName;
                }
                if (drop.itemRef) {
                    formattedDrop.item_ref = drop.itemRef;
                }
                if (drop.itemPool) {
                    formattedDrop.pool_ref = drop.itemPool;
                }
                return formattedDrop;
            });
            var formattedArray = {'harvest_items': formattedDrops};
            $("#export-area").jsonBrowse(formattedArray,{withQuotes: true});
            $(".export-modal").modal("show");
        },

        /** Open the import modal */
        openImportModal: function() {
            app.importedJson = '';
            $("#import-alert").collapse('hide');
            $("#import-area").html("");
            $('.import-modal').modal('show');
        },
        /** Import drops file */
        importFile: function(event) {
            if (event.target.files.length == 0) {
                return;
            }
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(e) {
                    try {
                        app.importedJson = JSON.parse(e.target.result);
                        $("#import-area").jsonBrowse(app.importedJson, {withQuotes: true});
                    } catch (error) {
                        $("#import-alert .error-name").text("Unable to parse JSON file");
                        $("#import-alert .error-content").text(error);
                        $("#import-alert").collapse('show');
                    }
                }
            })(file);
            reader.readAsBinaryString(file);
        },
        convertFileContent: function() {
            var dropCount = 0;
            app.drops = $.map(app.importedJson.harvest_items, function(drop) {
                dropCount++;
                var formattedDrop = {};
                formattedDrop.id = dropCount;
                formattedDrop.type = drop.type;
                formattedDrop.stateCount = drop.state.length;
                formattedDrop.states = [];
                var stateCount = 0;
                for (var stateId in drop.state) {
                    stateCount++;
                    formattedDrop.states.push({'id': stateCount, 'name': stateId, 'value': drop.state[stateId].value});
                }
                formattedDrop.itemName = drop.item_name;
                formattedDrop.itemRef = drop.item_ref;
                formattedDrop.itemPool = drop.pool_ref;
                return formattedDrop;
            });
            if (app.drops.length > 0) {
                window.onbeforeunload = function(){
                    return 'Are you sure you want to leave ?';
                };
            }
            $('.modal').modal('hide');
        }
    }
});

$(function() {
    document.getElementById('importFile').addEventListener('change', app.importFile, false);
});
