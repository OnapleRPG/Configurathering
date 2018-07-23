const app = new Vue({
    el: '#container',
    data : {
        miners : [],
        exportedJson: [],
        blockAdapter : {},
        importedJson : "",
        blockImage : []
    },
    mounted: function () {
        var self = this;
        $.getJSON('../assets/blockitem.json').done(function(data){
           self.blockImage = $.map(data,function(elem) {
               return {id: elem.text_type, img: elem.type + '-' + elem.meta + '.png'};
           } );
        });
        self.blockAdapter = new Bloodhound({
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            prefetch: {
                url: '../assets/blockitem.json',
                filter: function (names) {
                    return $.map(names, function (name) {
                        if(name.type <=255) {

                            return {name: 'minecraft:' + name.text_type, img: name.type + '-' + name.meta};
                        }
                    });
                }

            }

        });

        self.blockAdapter.clearPrefetchCache();
        self.blockAdapter.initialize();
    },
    methods : {
        addMiner : function(){
          let miner = {
              id : UUID(),
              blocks : [],
              inherits : []
          };

            setTimeout(function(){$(`#collapse${miner.id} .typeahead`).typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                },
                {
                    name: 'items',
                    source: app.blockAdapter.ttAdapter(),
                    display:'name',

                    templates: {
                        empty: [
                            '<div class="empty-message">',
                            'Aucun item existe avec ce nom',
                            '</div>'
                        ].join('\n'),
                        suggestion: Handlebars.compile('<div><img src="../assets/item/{{img}}.png"><strong>{{name}}</strong> </div>')
                    }
                })},50);


          app.miners.push(miner);
          app.$forceUpdate();
        },
        addBlock : function(id){
            let blockname = $(`input[name=block${id}`).val();

            if(!blockname){
                return;
            }


            let block = {
                id : UUID(),
                minable : blockname,
                img : app.blockImage.find(function (elem) {
                    return blockname.includes(elem.id);
                }).img
            };
            console.log(block);
            app.miners.find(function (elem) {
                console.log(elem.id === id);
                return elem.id === id
            }).blocks.push(block);
            app.$forceUpdate();
        },
        removeBlock : function(id,blockid){
           var blocks = app.miners.find(function(elem){
                return elem.id === id
            }).blocks;
            app.miners.find(function(elem){
                return elem.id === id
            }).blocks   =  blocks.filter(function(value) { return value.id !== blockid;});
        },
        addInherit : function(id){

            let inheritName = $(`input[name=inherit${id}`).val();

            if(!inheritName){
                return;
            }
            app.miners.find(function (elem) {
                console.log(elem.id === id);
                return elem.id === id
            }).inherits.push(inheritName);
            $(`input[name=inherit${id}`).val("");
            app.$forceUpdate();

        },
        removeInherit : function(id,inherit){
            let inherits = app.miners.find(function (elem) {
                console.log(elem.id === id);
                return elem.id === id
            }).inherits;
            inherits.splice(inherits.indexOf(inherit),1);
            app.$forceUpdate();
        },
        clearInherits: function(id){
             app.miners.find(function (elem) {
                console.log(elem.id === id);
                return elem.id === id
            }).inherits = [];
            app.$forceUpdate();
        },
        importFile: function(event) {
            if (event.target.files.length === 0) {
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
        convertFileContent: function(event) {
            let importedObject = app.importedJson;
            let importedData = app.importMiners(importedObject);
            console.log(importedData);
            app.miners = importedData;
            $('.modal').modal('hide');
            app.$forceUpdate();
        },

        importMiners: function (importedObject) {
             let retour = $.map(importedObject,function(elem){
                let miner = {};
                miner.id = UUID();
                miner.index = elem.id;
                miner.inherits = elem.inherit;
                miner.blocks = $.map(elem.mine_types,function(e){
                    let block = {};
                    block.id = UUID();
                    block.minable = e;
                    block.img = app.blockImage.find(function (elem) {
                        return e.includes(elem.id);
                    }).img;
                    return block;
                });
                return miner
            });
            console.log(retour);
            return retour

        },
        exportJSON : function(){
            let formattedArray = $.map(app.miners,function(elem){
                let miner = {};
                miner.id = elem.index;
                miner.inherit = elem.inherits;
                miner.mine_types = $.map(elem.blocks,function(e){
                    return e.minable;
                });
                return miner;
            });
            $("#export-area").jsonBrowse(formattedArray,{withQuotes: true});
            $("#export-modal").modal("show");
        },
        importModal : function(){

            app.importedJson = '';
            $("#import-alert").collapse('hide');
            $("#import-area").html("");
            $("#importModal").modal("show")
        }
    }
});

$(function() {
    document.getElementById('importFile').addEventListener('change', app.importFile, false);
});

function UUID() {
    return  Math.floor((1 + Math.random()) * 0x100000);
}