var getIdGlobalLocation = function () {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            get_id_global_location: '1',
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var updateValueList = function (table, values, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                update_value_list: '1',
                table: table,
                values: values,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (data.trim() !== '1') {
            $.alert('Error - ' + data);
        }
        else if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var updateValue = function (table, item, value, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                update_value: '1',
                table: table,
                col: item,
                value: value,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (data.trim() !== '1') {
            alert('Error when trying update database  ' + data);
        }
        else if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var deleteValue = function (table, where_col, where_value, callback) {

    return $.post(
            "/ajax",
            {
                delete_value: '1',
                table: table,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var insertValueList = function (table, values) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            insert_value_list: '1',
            table: table,
            values: values
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var insertValueListAsync = function (table, values, callback) {
    return $.post(
            "/ajax",
            {
                insert_value_list: '1',
                table: table,
                values: values
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    });
};
var insertValue = function (table, col, value) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            insert_value: '1',
            table: table,
            col: col,
            value: value
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var getValue = function (table, col, where_col, where_value) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            get_value: '1',
            table: table,
            col: col,
            where_col: where_col,
            where_value: where_value
        },
        dataType: "text"
    }
    ).responseText.trim();
};
var getValueAsync = function (table, col, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                get_value_async: '1',
                table: table,
                col: col,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );

};
var getValueList = function (table, col, where_col, where_value, callback) {
    return $.post(
            "/ajax",
            {
                get_value_list: '1',
                table: table,
                col: col,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );

};
var getValueListSync = function (table, col, where_col, where_value) {
    return $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        dataType: "json",
        data: {
            get_value_list: '1',
            table: table,
            col: col,
            where_col: where_col,
            where_value: where_value
        }
    }).responseJSON;
};
var getValues = function (table, where_col, where_value,callback) {
    return $.post(
            "/ajax",
            {
                get_values: '1',
                table: table,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );

};
var getFullValues = function (table, where_col, where_value,callback) {
    return $.get(
            '/get_full_values',
            {
                table: table,
                where_col: where_col,
                where_value: where_value
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            'json'
            );

};

var checkFreeIp = function (ip) {
    var device,
            response;
    if (ip === '0.0.0.0' || ip === '') {
        return true
    }
    response = $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            check_ip: '1',
            ip: ip
        },
        dataType: "text"
    }
    ).responseText.trim();
    if (response !== '0') {
        /*device = JSON.parse(response);
         warningMessage('<br>Device exist with ip ' + device['mng_ip'] + ':<br>\
         Model ' + device['model'] + ', in rack ' + device['name'] + ', slot ' + device['unit']);
         $('.ip').css({'border': 'solid 2px red'});*/
        return false;
    }
    else {
        return true
    }

}
var getDeviceInfo = function (idDevice, callback) {
    return  $.post(
            "/ajax",
            {
                device_json_info: '1',
                id_device: idDevice
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"
            );
};
var getDeviceThatUseIp = function (ip) {
    var device,
            response;
    if (ip === '0.0.0.0' || ip === '') {
        return false
    }
    response = $.ajax({
        url: "/ajax",
        async: false,
        type: "POST",
        data: {
            check_ip: '1',
            ip: ip
        },
        dataType: "text"
    }
    ).responseText.trim()
    if (response !== '0') {
        return JSON.parse(response);
    }
    else {
        return false
    }

}
var getInterfaceList = function (idDevice, callback) {
    return $.post(
            "/ajax",
            {
                get_interface_list: '1',
                id_device: idDevice
            },
    function (data) {
        if (typeof callback !== 'undefined') {
            callback(data);
        }
    },
            "json"

            );
}