const app = new Vue({
    el: '#container',
    data: {
        items: [],
        itemsCount: 0,
        exportedJson: "",
        importedJson: "",
        baseList : [],
        enchantList:[],
        itemsAdapter : {},
        modifiersList:[
            "generic.maxHealth",
            "generic.followRange",
            "generic.movementSpeed",
            "generic.attackDamage",
            "generic.armor",
            "generic.armorToughness",
            "generic.attackSpeed"
        ],
        slots : [
            "mainhand",
            "offhand",
            "head",
            "chest",
            "legs",
            "feet"
        ]
    },
    mounted: function () {
        var self = this;
        $.getJSON("../assets/enchants.json").done(function(data){self.enchantList = data});
        $.getJSON("../assets/blockitem.json").done(function(data){
            self.baseList = $.map(data, function(value){
                return value.text_type;
            })

        });
        self.itemsAdapter = new Bloodhound({
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            // url points to a json file that contains an array of country names, see
            // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
            prefetch: {
                url: '../assets/blockitem.json',
                filter: function (names) {
                    return $.map(names, function (name) {
                        console.log(name);
                        return {name: name.text_type,img : name.type + '-' + name.meta};
                    });
                }
            }
        });


    },
    methods: {
        addEnchant : function(itemId){
            var enchantName = $("#enchantSelect"+itemId).val();
            var enchantLevel = $("#enchantLevel"+itemId).val();
            var enchant = {};

            enchant = { name : enchantName ,level : enchantLevel, id : UUID()};
            app.items.find(function(elem){return elem.id == itemId}).enchants.push(enchant);
            app.$forceUpdate();
        },
        deleteEnchant: function (itemId,enchantId) {
            var enchants = app.items.find(function(elem) {return elem.id == itemId}).enchants;
            app.items.find(function(elem) {return elem.id == itemId}).enchants = enchants.filter(function(value) { return value.id != enchantId});
            app.$forceUpdate();
        },
        deleteAttribute: function(itemId,attributeId){
            var attributes = app.items.find(function(elem) {return elem.id == itemId}).attributes;
            app.items.find(function(elem) {return elem.id == itemId}).attributes = attributes.filter(function(value) { return value.id != attributeId;});
            app.$forceUpdate();
        },
        addItem : function () {
            app.itemsCount++;

            setTimeout(function(){$('#collapse'+app.itemsCount +' .typeahead').typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                },
                {
                    name: 'items',
                    source: app.itemsAdapter,
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
            app.items.push({id : app.itemsCount,type : '',name:'',lore:'',durability : 0,unbreakable : false,miners : [], enchants : [],attributes : []});
            app.$forceUpdate();
        },
        addMiner: function(itemId) {
            var miner = $("#minerNo"+itemId).val();
            app.items.find(function(elem) {return elem.id == itemId}).miners.push(miner);
            app.$forceUpdate();
        },
        removeMiner: function(itemId, miner) {
            var miners = app.items.find(function(elem) {return elem.id == itemId;}).miners;
            miners.splice(miners.indexOf(miner), 1);
            app.$forceUpdate();
        },
        addModifier : function(itemId){
            let uuid = UUID();
            app.items.find(function (elem) {
                return elem.id == itemId
            }).attributes.push({id : uuid,type : '',slot : '',operation : 0, amount : 0})
            setTimeout(function() {
                $('#item' + itemId + 'Attribute' + uuid).tab('show');
            });
        },
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
        convertFileContent: function(event) {
            var importedObject = app.importedJson;
            var importedData = app.importItems(importedObject);
            app.itemsCount = importedData.length;
            app.items = importedData;
            $('.modal').modal('hide');
            app.$forceUpdate();
        },
        
        importItems: function (importedObject) {
            console.log(importedObject);
            $.map(importedObject,function(elem){
                if(elem.enchants === undefined)
                    elem.enchants = [];
                if(elem.attributes === undefined)
                    elem.attributes = [];
                if(elem.miners === undefined)
                    elem.miners = [];
               return elem;
            });
            return importedObject;
        },
        exportJSON : function(){
            let formattedArray = $.map(app.items,function(item){
               let elem = {};
               elem.id=item.id;
               elem.type= item.type;
                elem.name=item.name;
               if(item.lore){
                   elem.lore=item.lore;
               }
               if(item.durability){
                   elem.durability = item.durability;
               }
               if(item.unbreakable){
                   elem.unbreakable = item.unbreakable;
               }
               if(item.miners.length>0){
                   elem.miners = item.miners;
               }
               if(item.enchants.length>0){
                   elem.enchants = item.enchants;
               }
               if(item.attributes.length>0){
                   elem.attributes =item.attributes.map(function (elem) {
                       delete elem.id;
                        return elem;
                   });
               }
               return elem;

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
  return  Math.floor((1 + Math.random()) * 0x10000);
}