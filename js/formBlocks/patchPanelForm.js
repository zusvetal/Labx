var patchPanelForm = function ($parentEl, idRack, topSlot, callback) {
    var dfd = $.Deferred();
    var modelList = new List('patchpanel_model', 'id_model', 'name');
    var body = '<div id="addForm" class="border"><div id="searchField"></div>\
               <div align="right">\
                    <button type="button" class="btn btn-primary submit">Insert patch panel</button>\
               </div></div>';
    $parentEl.html(body);
    modelList.getElementsDropDown($parentEl.find('#searchField'));
    $parentEl.off('click.panel', 'button.submit');
    $parentEl.on('click.panel', 'button.submit', function () {
        var idModel = modelList.getElementId(),
                idPatchpanel;
        if (idModel !== '0') {
            idPatchpanel = insertValue('patchpanel_list', 'id_model', idModel);
            updateValue('patchpanel_list', 'id_rack', idRack, 'id_patchpanel', idPatchpanel)
                    .then(function () {
                        return updateValue('patchpanel_list', 'unit', topSlot, 'id_patchpanel', idPatchpanel);
                    })
                    .then(function () {
                        $parentEl.empty();
                        dfd.resolve($parentEl);
                        if (callback && typeof (callback) === "function") {
                            callback();
                        }
                    });
        }
        else {
            modelList.focusToInputField();
        }
    });
    return dfd.promise();
};

