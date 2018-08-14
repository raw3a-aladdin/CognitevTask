//---------------------------Creating Roles-------------------------------
var acl = require('./acl.js');

acl.createRole('admin');
acl.createRole('user');
acl.createRole('guest');

//---------------------------Setting permissions-------------------------------
var {a , an} = require('./acl.js');

an('admin').can('get').from('/users');
an('admin').can('post').to('/users');
console.log(a('user').can('post').to('/users/2/articles').when((params, user) => user.id === params.userId));
a('guest').can('get').from('/articles');

//---------------------------Checking Permissions-------------------------------
var check = require('./acl.js').check;

console.log(check.if('guest').can('post').to('/users')); // false 
console.log(check.if('admin').can('post').to('/users')); // true
console.log(check.if('guest').can('get').from('/articles')); // true
console.log(check.if('user').can('post').to('/users/10/articles').when({ userId: 10 })); // true
