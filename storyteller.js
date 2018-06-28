let pageIndex = 0;
let buttonIndex = 0;
let actionIndex = 0;
let editing = false;
let pages = [];


let buttonTemplate = function (page) {

    return `<div class="card">
                <div class="card-header" id="page${page.index}_header${page.buttonIndex}">
                    <h5 class="mb-0">
                        <button type="button" class="btn btn-link" data-toggle="collapse" data-target="#page${page.index}_collapse${page.buttonIndex}" aria-expanded="true" aria-controls="page${page.index}_collapse${page.buttonIndex}">Bouton ${page.buttonIndex}</button><button type="button" class="close removebutton" data-page=${page.index} data-button=${page.buttonIndex} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>
                </div>
                <div id="page${page.index}_collapse${page.buttonIndex}" class="collapse" aria-label="page${page.index}_collapse${page.buttonIndex}" data-parent="buttonlist${page.index}">
                    <div class="card-body">
                        <div class="form-row m-1">
                            <div class="col"><input type="text" class="form-control" id="page${page.index}_button${page.buttonIndex}_text" placeholder="Texte" /></div>
                            <div class="col"><input type="text" class="form-control" id="page${page.index}_button${page.buttonIndex}_color" placeholder="Color" /></div>
                        </div>
                        <div class="card m-2 p-0">
                          
                            <ul class="list-group list-group-flush" id="page${page.index}_button${page.buttonIndex}_actions">
                            </ul>     
                            <div class="card-footer border-top-0">
                                <div class="form-row">
                                    <div class="col">
                                        <select name="page${page.index}_button${page.buttonIndex}_type" class="form-control">
                                            <option value="OPEN_DIALOG">Ouvre un dialogue</option>
                                            <option value="EXECUTE_COMMAND">Execute une commande</option>
                                            <option value="GIVE_ITEM">Donne un objet</option>
                                            <option value="REMOVE_ITEM">Prend un objet</option>
                                            <option value="TELEPORT">Teleporte a des coordonnées</option>
                                            <option value="SET_OBJECTIVE">Met un objectif</option>
                                            <option value="START_KILL_COUNT">Prend objet</option>
                                            <option value="STOP_KILL_COUNT">Prend objet</option>
                                        </select>
                                    </div>
                                    <div class="col"><input type="text" name="page${page.index}_button${page.buttonIndex}_arg" class="form-control" placeholder="Args" /></div>
                                    <div class="col-auto"><button type="button" data-page="${page.index}" data-button="${page.buttonIndex}" class="btn btn-primary addActionbtn">ajouter</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
};

let pageTemplate = function (page) {
    return ` <div class="tab-pane fade show active" id="page${page.index}" role="tabpanel" aria-labelledby="page${page.index}-tab">
<div class="form-group row">
    <label for="pagetext${page.index}" class="col-sm-2 col-form-label">text : <span class="text-danger">*</span></label>
    <div class='col-sm-10'>
        <textarea class="form-control" id="pagetext${page.index}"></textarea>
        <small id="pagetext1Help" class="form-text text-muted">Texte inscrit sur la page.</small>
    </div>
</div>
<button type="button" class="btn btn-info addButtonbtn m-2" data-index="${page.index}">Ajouter un bouton</button>
<div id="buttonlist${page.index}">
</div>`
};

function createpage(page) {
    let li = $(`<li class="nav-item active"><a id="pagelink${page.index}" class="nav-link" data-toggle="tab" href="#page${page.index}" role="tab" aria-controls="page${page.index}" aria-selected="true">Page ${page.index}</a></li>`);
    $(li).insertBefore($("#addpageButton").parent());

    $("#page-content").append(pageTemplate(page));
    $(li).find("a").tab('show');
}

function createButton(page) {
    $(`#buttonlist${page.index}`).append(buttonTemplate(page))
}
/*
$(function () {


    $('#trigger').tokenfield();

    $("#page-content").on("click", ".addActionbtn", function () {
        var page = $(this).data("page");
        var button = $(this).data("button");


        var type = $(`#page${page}_button${button}_type`).val();
        var arg = $(`#page${page}_button${button}_arg`).val();

        $(`#page${page}_button${button}_actions`).append(`<li class="list-group-item" data-type="${type}" data-args="${arg}"><span class="badge badge-info">${type}</span>&nbsp;${arg}<button type="button" class="close removeAction" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button></li>`)
    });


    pages.push({
        index: pageIndex,
        buttonIndex: 0,
        buttons: []
    });
    createpage(pages[pages.length - 1])
    $('#pageTabs a').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    $("#addpageButton").on("click", function () {
        pageIndex += 1;
        pages.push({
            index: pageIndex,
            buttonIndex: 0,
            buttons: []
        });
        createpage(pages[pages.length - 1])

    });
    $("#page-content").on("click", ".addButtonbtn", function () {
        var index = $(this).data("index");
        console.log(index);
        pages[index].buttons.push({
            actions: []
        });
        createButton(pages[index]);
        pages[index].buttonIndex += 1;
        $('.collapse').collapse();
    })

    $("#page-content").on("click", ".removeAction", function () {
        var page = $(this).data("page")
        var button = $(this).data("button")
        var action = $(this).data("action")
        $(this).parent().remove()
        pages[page].buttons[button].actions.splice(action);
    })

    $("#page-content").on("click", ".removebutton", function () {
        var page = $(this).data("page")
        var button = $(this).data("button")
        $(this).parent().parent().parent().remove()
        pages[page].buttons.splice(button);
    })

    $("#dialogs-grid").on("click", ".btn-action", function () {
        var index = $(this).data("value")
        var d = dialogs.find(function (element) {
            return element.id == index;
        });
        console.log(d)
        loadDialog(d)
    });

    $("#dialogs-grid").on("click", ".btn-remove", function () {
        var index = $(this).data("value")
        var d = dialogs.findIndex(function (element) {
            return element.id == index;
        });
        console.log(d);
        dialogs.splice(d);
        $('#dialogs-grid').bootstrapTable("load", dialogs);
    });


    $("#addDialogbtn").click(function () {
        dialog = {};
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            pages[i].text = $(`textarea[name=pagetext${i}]`).val()

            for (var j = 0; j < page.buttons.length; j++) {
                pages[i].buttons[j].text = $(`input[name=page${i}_button${j}_text]`).val()
                pages[i].buttons[j].color = $(`input[name=page${i}_button${j}_color]`).val()
            }

        }
        dialog.id = $("input[name=index]").val();
        dialog.objectif = $("input[name=objectif]").val();
        dialog.trigger = $("input[name=trigger]").tokenfield('getTokensList').split(",");
        dialog.item = $("input[name=item]").val();
        dialog.pages = pages;
        if (editing) {
            var pos = dialogs.findIndex(function (e) {
                return e.id === dialog.id
            });
            console.log(pos);
            dialogs[pos] = dialog
        } else {
            dialogs.push(dialog)
        }


        $('#dialogs-grid').bootstrapTable("load", dialogs);
        reset();
    });

    $("#dialog-form").submit(function () {
        var form = $(this).serializeArray();

        form.pages = getPages();
        console.log(form);
        return false;
    });

    $('#dialogs-grid').bootstrapTable({
        url: "/list/storyteller",
        responseHandler: function (res) {
            return res.dialogs
        },
    }).on('load-success.bs.table', function () {
        console.log("loaded");
    });

    function reset() {
        pageIndex = 0;
        buttonIndex = 0;
        actionIndex = 0;
        editing = false;
        pages = [];
        $("#page-content").children("div").remove()
        $("#pageTabs li:not(:last)").remove()
        $("input[name=index]").val("");

        $("input[name=objectif]").val("");
        $('#trigger').tokenfield('setTokens', []);
        $("input[name=item]").val("");
        pages.push({
            index: pageIndex,
            buttonIndex: 0,
            buttons: []
        })
        createpage(pages[pages.length - 1])

    }

    $("#submit").on("click", (e) => {
        console.log("click");
        dialogs = $("#dialogs-grid").bootstrapTable('getData');
        $.ajax({
            method: "POST",
            url: "/git/sendfile/storyteller",
            data: JSON.stringify({dialogs: dialogs}),
            contentType: 'application/json; charset=UTF-8',
            success: (data) => {
                console.log(data);
            },
            error: (e) => {
                console.log(e);
            }
        })
    });
});

function getPages() {
    let pages = []
    for (var i = 0; i < $("#page-content").children("div").length; i++) {
        var page = {};
        page.text = $(`textarea[name=pagetext${i}]`).val()
        page.buttons= getButtons()
        pages.push(page);
    }
    return pages

}

function getButtons(pageindex) {
    var buttons = [];
    var currentPage = $(`#buttonlist${pageindex}`);

    for (var j = 0; j < currentPage.children("div").length; j++) {
        var button = {};
        button.text = $(`#page${i}_button${j}_text`).val()
        button.color = $(`#page${i}_button${j}_color`).val()
        button.actions = getActions(pageIndex, j);
        buttons.push(buttons)
    }
    return buttons
}

function getActions(pageIndex, buttonIndex) {
   let lis = $(`#page${pageIndex}_button${buttonIndex}_actions`).children("li");
   var actions = [];
   $.each(lis,(index,value)=>{
       let action = {};
       action.type = value.data("type");
       action.arg = value.data("arg");
       actions.push(action)
   });
    return actions;
}

function loadDialog(dialog) {
    $("#page-content").children("div").remove()
    $("#pageTabs li:not(:last)").remove()
    $("input[name=index]").val(dialog.id);
    $("input[name=index]").attr("readonly", true);
    $("input[name=objectif]").val(dialog.objectif);
    $('#trigger').tokenfield('setTokens', dialog.trigger);
    $("input[name=item]").val(dialog.item);
    editing = true;
    pages = dialog.pages;
    for (var i = 0; i < dialog.pages.length; i++) {
        var page = dialog.pages[i];
        page.index = i;
        page.buttonIndex = 0
        createpage(page)
        console.log(page)
        $(`textarea[name=pagetext${i}]`).val(page.text)

        if (page.buttons) {
            for (var j = 0; j < page.buttons.length; j++) {
                createButton(page)
                var button = page.buttons[j];
                console.log(`page${i}_button${j}_text`)
                $(`input[name=page${i}_button${j}_text]`).val(button.text)
                $(`input[name=page${i}_button${j}_color]`).val(button.color)
                if (button.actions) {
                    for (var k = 0; k < page.buttons[j].actions.length; k++) {
                        action = button.actions[k];
                        $(`#page${i}_button${j}_actions`).append(`<li class="list-group-item"><span class="badge badge-info">
${action.name}</span>&nbsp;${action.arg}<button type="button" class="close removeAction" data-page="${i}" data-button="${j}"
 data-action="${k}"  aria-label="Close"><span aria-hidden="true">&times;</span></button></li>`)
                    }
                }
            }
        }

    }
}*/

const app = new Vue({
    el: '.container',
    data: {
        pages: []
    },
    methods: {
        addPage: function(event) {
            var pageNumber = app.pages.length + 1;
            app.pages.push({'id': pageNumber});
            // Tab switch not working dynamically ! Didn't the tab appear yet ?
            $('#page-' + pageNumber + '-link').tab('show');
        },
        addButton: function(pageId) {
            if (!app.pages[pageId - 1].buttons) {
                app.pages[pageId - 1].buttons = [];
            }
            app.pages[pageId - 1].buttons.push({'id': app.pages[pageId - 1].buttons.length + 1});
            this.$forceUpdate();
        },
        removeButton: function(pageId, buttonId) {
            app.pages[pageId - 1].buttons = app.pages[pageId - 1].buttons.splice(buttonId - 1, buttonId - 1);
            this.$forceUpdate();
        }
    }
});
