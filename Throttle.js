var _ = require('lodash'),
    Q = require('q');

//A throttling promise that will call progress for each finished portion and and finish the promise when it is completed.

module.exports = function(values,max,iterator){
  max = max -1;
  var deferred = Q.defer();
  var list = _.clone(values).reverse();
  var outstanding = 0;
  function catchingFunction(value){
    deferred.notify(value);
    outstanding--;
    if(list.length){
      outstanding++;
      iterator(list.pop())
      .then(catchingFunction);
    }
    else if(outstanding===0){
      deferred.resolve();
    }
  }
  while(max-- && list.length){
    iterator(list.pop())
    .then(catchingFunction);
    outstanding++;
  }
  return deferred.promise;
};
