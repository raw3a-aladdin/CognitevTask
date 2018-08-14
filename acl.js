var roles=[];
var users=[
    {
        name:'rawaa',
        id: '1',
        role:'admin'
    },
    {
        name:'rawaa1',
        id: '2',
        role:'user'
    },
    {
        name:'rawaa2',
        id: '3',
        role:'guest'
    }
];

//---------------------------Creating Roles-------------------------------
var createRole = function (role) {
    roles.push({'role':role.toLowerCase() , 'can':[]});
}

//---------------------------Setting permissions-------------------------------
var an = function (role){
    fromObj.role = role.toLowerCase();
    return canObj;
}

var a = an;

var canObj = {
    can : function(verb){
        var verbLC = verb.toLowerCase();
        fromObj.verb= verbLC;
        if(verbLC ==='post' || verbLC ==='patch' || verbLC ==='put'){
            return toObj;
        }else if ( verbLC ==='get' || verbLC ==='delete' ){
            return fromObj;
        }  
    }
}

var fromObj = {
    role:'',
    verb:'',
    from: function(path){
        var tableName= path.split('/')[1];
        //console.log(this);
        roles.find((obj) => { return obj.role === this.role }).can.push({'verb' : this.verb, 'table': tableName});
        whenObj.role=this.role;
        whenObj.verb=this.verb;
        whenObj.path = path;
        return whenObj;
    }
}

var toObj = {
    to: function(path){
        return fromObj.from(path);
    }
}

var whenObj = {
    role:'',
    verb:'',
    path:'',
    callbackFunc: function(){},
    when: function(func){
        //console.log(typeof func ==='function');
        var user;
        var params={userId: this.path.split('/')[2] } ;
        if(typeof func ==='function'){
            user = users.find(function (obj) { return obj.id === params.userId });
            this.callbackFunc = func;
        }else{
            user = {id: func.userId.toString()};
        }
        //console.log(this.callbackFunc);
        return this.callbackFunc(params,user);
    }
}

//---------------------------Checking Permissions-------------------------------
var check = {
    if: function (role) {
        fromObjCheck.role = role.toLowerCase();
        return canObjCheck;
    }
};

var canObjCheck = {
    
    can : function(verb){
        var verbLC = verb.toLowerCase();
        fromObjCheck.verb= verbLC;
        if(verbLC ==='post' || verbLC ==='patch' || verbLC ==='put'){
            return toObjCheck;
        }else if ( verbLC ==='get' || verbLC ==='delete' ){
            return fromObjCheck;
        }
        
    }
}

var fromObjCheck = {
    role:'',
    verb:'',
    from: function(path){
        var tableName= path.split('/')[1];
        var permissionFound = roles.find((obj) => { return obj.role === this.role }).can.find((ob) => { return ob.verb === this.verb && ob.table === tableName });
        if(path.split('/').length < 3){
            return permissionFound? true:false;
        }else{
            whenObj.role=this.role;
            whenObj.verb=this.verb;
            whenObj.path = path;
            return whenObj;
        }
        
    }
}

var toObjCheck = {
    to: function(path){
        return fromObjCheck.from(path);
    }
}

//-------------------------------------------Exports-------------------------------------------
module.exports = {
    createRole : createRole,
    a : a,
    an : an,
    check : check
}
