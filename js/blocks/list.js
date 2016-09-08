var List = function (table, idField, searchField, options) {
    /*
     * settings.width  from 1 to 12
     */
    var settings = {
        type: 'dropdown',
        width: '8',
        addition: false
    };
    if (options) {
        $.extend(settings, options);
    }
    this.table = table;
    this.idField = idField;
    this.searchField = searchField;
    this.getElementsDropDown = function ($parentEl, callback) {
        this.$parentEl = $parentEl;
        var eventListener = this.eventListener,
                getLiveSearchList = this.getLiveSearchList,
                postParam = {
                    elements_dropdown: '1',
                    table: table,
                    id_col: idField,
                    search_col: searchField,
                    type: settings.type
                };

        if (settings.addition) {
            postParam['addition'] = settings.addition;
        }
        return  $.post("/ajax", postParam)
                .then(function (data) {
                    $parentEl.html(data);
                    $parentEl.find('.width').addClass('col-lg-' + settings.width);
                    if (typeof callback !== 'undefined') {
                        callback($parentEl);
                    }
                    eventListener($parentEl, getLiveSearchList);
                });
    };
    this.eventListener = function ($parentEl, getLiveSearchList) {
        $parentEl.on('keyup.search', 'input.search-element', function (event) {
            var noCharKey = [37, 38, 39, 40, 13, 16, 17, 18, 20, 19, 33, 34];
            var key = event.keyCode,
                    inputValue = $(this).val().trim(),
                    $itemField = $parentEl.find('ul.search-element-list'),
                    $searchButton = $parentEl.find('button.elements-toggle'),
                    $input = $parentEl.find('input.search-element'),
                    idElement;
            if (key === 40) {
                $itemField.slideDown()
                        .find('li:nth-of-type(1) a')
                        .focus();
                return false;
            }
            if ($.inArray(key, noCharKey) == -1)
            {
                getLiveSearchList(inputValue, function (data) {
                    if (data.trim() !== '0') {
                        var listOfElement = JSON.parse(data);
                        var list = '';
                        for (var id_element in listOfElement) {
                            list += '<li><a href="#searchInput" data-id-element="' + id_element + '">' + listOfElement[id_element] + '</a></li>';
                        }
                        $itemField.html(list)
                                .slideDown();
                    }
                    else {
                        $itemField.slideUp();
                    }
                    /*check existing of elements in database*/
                    getValueAsync(table, idField, searchField, inputValue)
                            .then(function (idElement) {
                                if (idElement) {
                                    $input.attr('data-id-element', idElement);
                                    $itemField.slideUp()
                                    $parentEl.trigger('changeElement', [idElement]);
                                }
                            });
                });
            } else {
                $itemField.slideUp();
                return false;
            }
            $(this).attr('data-id-element', '0');
            $parentEl.trigger('changeElement', ['0']);
        });

        $parentEl.on('keydown.search', 'ul.search-element-list a', function (event) {

            var key = event.keyCode,
                    $input = $parentEl.find('input.search-element'),
                    $target = $(this),
                    $itemField = $parentEl.find('ul.search-element-list'),
                    value = $target.text(),
                    idElement;

            //$target = $(event.target);
            // console.log(event);
            switch (key) {

                case 37:
                    //left
                    event.preventDefault();
                    $input.focus();
                    $itemField.slideUp();
                    break;
                case 40:
                    //down
                    event.preventDefault();
                    $target.closest('li')
                            .next()
                            .find('a')
                            .focus();
                    break;
                case 38:
                    //up
                    var $prevEl = $target.closest('li')
                            .prev()
                            .find('a');
                    event.preventDefault();
                    if ($prevEl.length === 0) {
                        $input.focus();
                        $itemField.slideUp();
                    }
                    else {
                        $prevEl.focus();
                    }
                    break;
                case 13:
                    //enter
                    event.preventDefault();
                    idElement = $target.data('idElement');
                    $input.attr('data-id-element', $target.data('idElement'))
                            .focus()
                            .val(value);
                    $parentEl.trigger('changeElement', [idElement]);
                    $itemField.slideUp();

                    break;

            }
        });

        $parentEl.on('click.search', 'ul.search-element-list a', function (event) {
            var $item = $(this),
                    $input = $parentEl.find('input.search-element'),
                    value = $item.text(),
                    idElement = $item.attr('data-id-element');
            event.preventDefault();
            $input.val(value);
            $input.focus();
            $input.attr('data-id-element', idElement);
            $parentEl.trigger('changeElement', [idElement]);
            $item.closest('ul.search-element-list')
                    .slideUp();
        });

        $parentEl.on('click.search', 'button.elements-toggle', function (event) {
            var $itemField = $parentEl.find('ul.search-element-list');
            if ($itemField.is(":visible")) {
                $itemField.slideUp();
            }
            else {
                $itemField.slideDown()
                        .find('li:nth-of-type(1) a')
                        .focus();

            }
        });
        $parentEl.on('change.search', 'select', function (event) {
            $parentEl.trigger('changeElement', [$(this).val()]);
        });
    };
    this.changeElement = function (callback) {
        this.$parentEl.on('changeElement', callback);
    };
    this.checkInDb = function (elementName) {
        var result = getValue(table, idField, searchField, elementName);
        return result === '0' ? false : result;
    };
    this.getLiveSearchList = function (inputValue, callback) {
        var postParam = {
            search_list: '1',
            value: inputValue,
            table: table,
            search_col: searchField,
            id_col: idField
        }
        if (settings.addition) {
            postParam['addition'] = settings.addition;
        }
        $.post(
                '/ajax', postParam,
                function (data) {
                    if (typeof callback !== 'undefined') {
                        callback(data);
                    }
                });
    };
    this.destroyEvents = function () {
        this.$parentEl.off('.search', '**');
    };
    this.addElementToDb = function (elementName, addition) {
        /*return id of adding to database element*/
        var insertValues = {};
        insertValues[searchField] = elementName;
        if (addition) {
            $.extend(insertValues, addition);
        }
        return insertValueList(table, insertValues);
    };
    this.getInputVal = function () {
        if (settings.type === 'dropdown' && this.$parentEl.find('input.search-element').val() !== undefined) {
            return this.$parentEl.find('input.search-element').val().trim();
        }
        else if (settings.type === 'select' && this.$parentEl.find('select.search-element :selected').text() !== undefined) {
            return this.$parentEl.find('select.search-element :selected').text();
        }
        return false;
    };
    this.setInputVal = function (value) {
        if (settings.type === 'dropdown') {
            return this.$parentEl.find('input.search-element').val(value);
        }
        else if (settings.type === 'select') {
            return  this.$parentEl.find(' select.search-element option:contains("' + value + '")').attr("selected", "selected");
        }
    };
    this.getElementId = function () {
        if (settings.type === 'dropdown') {
            return this.$parentEl.find('input.search-element').attr('data-id-element');
        }
        else if (settings.type === 'select') {
            return this.$parentEl.find('select.search-element').val();
        }

    };
    this.setElementId = function (id) {
        if (settings.type === 'dropdown') {
            return this.$parentEl.find('input.search-element').attr('data-id-element', id);
        }
        else if (settings.type === 'select') {
            return this.$parentEl.find('.search-element [value="' + id + '"]').attr('selected', 'selected');
        }
    };
    this.focusToInputField = function () {
        this.$parentEl.find('.search-element').focus();
    };
    this.addClassToInputField = function (className) {
        this.$parentEl.find('.search-element').addClass(className);
    };
    this.removeElementsDropDown = function () {
        if (this.$parentEl) {
            this.destroyEvents();
            if (this.$parentEl.find('.search-element').length > 0) {
                this.$parentEl.text(this.getInputVal());
            }
        }
    };

};