const app = new Vue({
    el: '#container',
    data: {
        harvestables: [],
        harvestableCount: 0,
        exportedJson: "",
        importedJson: ""
    },
    methods: {

        /** Get a harvestable from its id */
        getHarvestableById: function(harvestableId) {
            return app.harvestables.find(function(element) {
                return element.id === harvestableId;
            });
        },
        /** Get a state from its id */
        getStateById: function(harvestableId, stateId) {
            var harvestable = app.getHarvestableById(harvestableId);
            return harvestable.states.find(function(element) {
                return element.id === stateId;
            });
        },

        /** Add a harvestable to the configuration */
        addHarvestable: function() {
            app.harvestableCount++;
            app.harvestables.push(
                {'id': app.harvestableCount, 'respawnMin': 0, 'respawnMax': 0, 'stateCount': 0, 'states': []}
            );
            window.onbeforeunload = function(){
                return 'Are you sure you want to leave ?';
            };
            app.$forceUpdate();
            setTimeout(function() {
                $('#harvestable-' + app.harvestableCount).collapse();
            });
        },
        /** Remove a harvestable from the configuration */
        removeHarvestable: function(harvestableId) {
            var harvestable = app.getHarvestableById(harvestableId);
            app.harvestables.splice(app.harvestables.indexOf(harvestable), 1);
            if (app.harvestables.length === 0) {
                window.onbeforeunload = null;
            }
            app.$forceUpdate();
        },
        /** Add a block state to the configured harvestable */
        addState: function(harvestableId) {
            var harvestable = app.getHarvestableById(harvestableId);
            harvestable.stateCount++;
            var stateName = $("#harvestable-" + harvestableId + "-state-name").val();
            var stateValue = $("#harvestable-" + harvestableId + "-state-value").val();
            harvestable.states.push(
                {'id': harvestable.stateCount, 'name': stateName, 'value': stateValue}
            );
            app.$forceUpdate();
        },
        /** Remove a block state from the configured drop */
        removeState: function(harvestableId, stateId) {
            var harvestable = app.getHarvestableById(harvestableId);
            var state = app.getStateById(harvestableId, stateId);
            harvestable.states.splice(harvestable.states.indexOf(state), 1);
            app.$forceUpdate();
        },

        /** Format exported JSON */
        exportJson: function() {
            var formattedHarvestables = $.map(app.harvestables, function(harvestable) {
                var formattedHarvestable = {};
                formattedHarvestable.type = harvestable.type;
                if (harvestable.states.length > 0) {
                    formattedHarvestable.state = {};
                }
                for(var state in harvestable.states) {
                    formattedHarvestable.state[harvestable.states[state].name] = harvestable.states[state].value;
                }
                formattedHarvestable.respawnmin = harvestable.minRespawn;
                formattedHarvestable.respawnmax = harvestable.maxRespawn;
                return formattedHarvestable;
            });
            var formattedArray = {'harvestables': formattedHarvestables};
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
        /** Import harvestables file */
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
        /** Convert imported JSON into harvestable data */
        convertFileContent: function() {
            var harvestableCount = 0;
            app.harvestables = $.map(app.importedJson.harvestables, function(harvestable) {
                harvestableCount++;
                var formattedHarvestable = {};
                formattedHarvestable.id = harvestableCount;
                formattedHarvestable.type = harvestable.type;
                formattedHarvestable.stateCount = (harvestable.state !== undefined) ? harvestable.state.length : 0;
                formattedHarvestable.states = [];
                var stateCount = 0;
                for (var stateId in harvestable.state) {
                    stateCount++;
                    formattedHarvestable.states.push({'id': stateCount, 'name': stateId, 'value': harvestable.state[stateId]});
                }
                formattedHarvestable.minRespawn = harvestable.respawnmin;
                formattedHarvestable.maxRespawn = harvestable.respawnmax;
                return formattedHarvestable;
            });
            if (app.harvestables.length > 0) {
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
