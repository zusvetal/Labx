/******************************************************************************/
/***************************** Add labdesk**********************************/
/******************************************************************************/
var insertLabdesk = function (name) {
    return insertValue('labdesks','name',name);
};

$('span.add').on('click', function () {
    $('table tr:nth-of-type(1)').before('\
                    <tr class="rack">\
                        <td class="value" data-item="name"></td>\
                        <td class="hide-td"><span class="glyphicon glyphicon-remove remove"></span></td>\
                    </tr>');
    $('table tr:nth-of-type(1)').find('.value').each(function () {
        var td = $(this);
        $(td).html('<input class="input-value form-control" type="text">');
    });
});


$('table').on('keypress', 'input', function (event) {
    var key = event.which,
            input = $(this),
            tr = $(input).closest('tr'),
            value,
            td,
            item,
            name,
            idLabdesk;
    if (key === 13) {   /*press Enter*/
        name=$(tr).find('[data-item="name"] input').val();
        $(tr).find('[data-item="name"]').text(name);
        idLabdesk = insertLabdesk(name);    
        $(tr).find('input').each(function () {
            value = $(this).val();
            td = $(this).closest('td');
            item = $(td).attr('data-item');
            $(td).text(value);
            if (item !== 'name') {
               updateValue('labdesks', item, value, 'id_labdesk', idLabdesk);
            }
        });
        $('table tr:last-of-type()').after(tr);
        $(tr).attr('data-id-labdesk', idLabdesk);
        highLightNewEntry(tr);
    }
});
/******************************************************************************/
/***************************** delete labdesk**********************************/
/******************************************************************************/

$('table').on('click', '.remove', function () {
    var $tr = $(this).closest('tr'),
            idLabdesk = $tr.attr('data-id-labdesk'),
            check = new CheckingAssets(),
            notification = new DeleteNotification($('#modalField'));
    check.devicesInLabdesk(idLabdesk)
            .then(function (devices) {
                if (devices.length === 0) {
                    return  $.confirm("Do you want to remove this labdesk?");
                }
                else {
                    notification.devicesInLabdesk(devices);
                    return $.Deferred();
                }
            })
            .then(function () {
                deleteValue('labdesks', 'id_labdesk', idLabdesk);
                return $tr.fadeOut('slow');
            })
            .then(function () {
                $tr.remove();
            });
});
/*******************************************************/

$('table').after('<button id="checkModules" class="btn btn-block btn-success">Checking...</button><br><div id="workField" class="well"><div>');

$('#checkModules').on('click', function () {
    $.ajaxSetup({
        timeout: false
    })
    getValueList('device_list', 'id_device', 'id_global_location', '1')
            .then(function (ids) {
//                ids = ['342', '343', '344','1000']
                for (var i in ids) {
                    getDeviceInfo(ids[i])
                            .then(function (device) {
                                if (device) {
                                    var idDevice = device['id_device'];
                                    $('#workField').prepend('<div id="' + idDevice + '" class="well">\
                                                            <hr>\
                                                            <b>' + device['model'] + ', S/N: ' + device['sn'] + '</b>\
                                                            <span class="status"></span>\
                                                            <div class="notification"></div>\
                                                        </div>')
                                    return checkDeviceModulesChanges($('#' + idDevice).find('.notification'), idDevice);
                                }
                                else{
                                    
                                  return $.Deferred();  
                                }                               
                            })
                            .then(function (data) {
                                
                                if(data.status){
                                    console.log(data.id)
                                    $('#' + data.id).find('.status').html('<span class="badge">Checked!</span>')
                                }
                                else{
                                   $('#' + data.id).find('.status').html('<span class="badge">This device doesn`t check</span>') 
                                }
                                
                            })
                            
                }
            })
})

/************test********************/
 function factorial (n){
    if(n==1){
        return 1;
    }
    else{
        return factorial(n-1)*n;
    }
}
function fact(n){
    var sum=1;
    for(var i=1;i<n+1;i++){
        sum*=i;
    }
    return sum;
}

var a=[9,2,1,5,0,8,6,0,7,3,8]


function sort(arr){
    for(var i=arr.length-1;i>0;i--){
        for(j=0; j<i; j++){
            if(arr[j]>arr[j+1]){
                var tmp=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=tmp
            }
        }
    }       
}
//sort(a)
//console.log(a);
function check(arr) {
    for (i = 0; i < arr.length; i++) {
        for (j = i+1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                return false;
            }
        }
    }
}
//console.log(check(a));

b=['ed','ad','dd','fs','as'];
c=['dd','gf','df','uu','fs','sd','ll'];

function common_arr(arr1,arr2){
    var div=[];
    for(var i=0 ;i<arr1.length;i++){
            for(var j=0;j<arr2.length;j++){
                if(arr1[i]==arr2[j]){
                    div.push(arr1[i]);
                }
        }
    }
    return div;
}
function separate_arr(arr1, arr2) {
    var div = [];
    var flag;
    for (var i = 0; i < arr1.length; i++) {
        flag = true;
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i] == arr2[j]) {
                flag = false;
                break
            }
        }
        if (flag) {
            div.push(arr1[i]);
        }
    }
    return div;
}
//console.log(separate_arr(b,c));


function find(arr, value) {
    var first = 0,
            last = arr.length - 1,
            mediana = 0;
   var i=0;
    while (i<10) {
        mediana = parseInt((first + last) / 2);
//       console.log(n=6.5,n.toFixed());
//        mediana=mediana.toFixed()
        console.log(mediana)
        if (arr[mediana] < value) {
            first = mediana + 1;
        }
        if (arr[mediana] > value) {
            last = mediana - 1;
        }
        if (arr[mediana] == value) {        
            return mediana;
        }
        if(first>last){
            console.log(first,last);
            throw('Error')
            return -1;
        }
        i++;
    }
}
//a.sort();
//console.log(a);
//index=find(a,4);
//console.log('index ='+index);
//

function BinarySearchTree() {
    this._root = null;
}
BinarySearchTree.prototype.contains = function (value) {
    var found = false,
            current = this._root

    //make sure there's a node to search
    while (!found && current) {

        //if the value is less than the current node's, go left
        if (value < current.value) {
            current = current.left;

            //if the value is greater than the current node's, go right
        } else if (value > current.value) {
            current = current.right;

            //values are equal, found it!
        } else {
            found = true;
        }
    }

    //only proceed if the node was found
    return found;
};
BinarySearchTree.prototype.add = function (value) {
    //create a new item object, place data in
    var node = {
        value: value,
        left: null,
        right: null
    },
    //used to traverse the structure
    current;

    //special case: no items in the tree yet
    if (this._root === null) {
        this._root = node;
    } else {
        current = this._root;

        while (true) {

            //if the new value is less than this node's value, go left
            if (value < current.value) {

                //if there's no left, then the new node belongs there
                if (current.left === null) {
                    current.left = node;
                    break;
                } else {
                    current = current.left;
                }

                //if the new value is greater than this node's value, go right
            } else if (value > current.value) {

                //if there's no right, then the new node belongs there
                if (current.right === null) {
                    current.right = node;
                    break;
                } else {
                    current = current.right;
                }

                //if the new value is equal to the current one, just ignore
            } else {
                break;
            }
        }
    }
};
BinarySearchTree.prototype.traverse = function (callback) {

    //helper function
    function inOrder(node) {
        if (node) {
            //traverse the left subtree
            if (node.left !== null) {
                inOrder(node.left);
            }

            //call the process method on this node
            callback.call(this, node);

            //traverse the right subtree
            if (node.right !== null) {
                inOrder(node.right);
            }
        }
    }

    //start with the root
    inOrder(this._root);
};
BinarySearchTree.prototype.size = function () {
    var length = 0;

    this.traverse(function (node) {
        length++;
    });

    return length;
}

BinarySearchTree.prototype.toArray = function () {
    var result = [];

    this.traverse(function (node) {
        result.push(node.value);
    });

    return result;
}

BinarySearchTree.prototype.toString = function () {
    return this.toArray().toString();
}
var tree = new BinarySearchTree();

//console.log(tree);
//tree.add(20);
//tree.add(10);
//tree.add(15);
//tree.add(30);
//console.log(tree.size());


var check = new CheckingAssets();
var notification=new DeleteNotification($(''))
check.devicesInRack('36')
        .then(function (devices) {
            if(devices.length !==0){
                console.log(devices);
            }
        })