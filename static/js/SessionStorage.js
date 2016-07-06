app.factory('SessionStorage', function() {
 var savedData = {}
 function set(data) {
   savedData = data;
   console.log(savedData);
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 }

});