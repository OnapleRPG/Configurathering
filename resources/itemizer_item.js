const app = new Vue({
    el: '#container',
    data: {
        items: [],
        itemsCount: 0,
        exportedJson: "",
        importedJson: "",
        baselist : "",
        enchantList:[],
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
            self.baselist =  $.map(data,function(value){

                return ({id : value.text_type , text : value.name})
            });

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
            /*setTimeout(function(){$("#base"+app.itemsCount).select2({
                data : app.baselist,
                theme:"bootstrap4",
                width : "100%",
                escapeMarkup: function(markup) {
                    return markup;
                },
                templateResult:function (data) {
                    if (data.loading) return data.name;
                    markup = "<img src='assets/item/" + data.img + ".png' ><span>" + data.text + "</span>" + "<small>" + data.img + "</small>";
                    return markup;
                }
            })},50);*/
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
        }
    }
});

function UUID() {
  return  Math.floor((1 + Math.random()) * 0x10000);
}