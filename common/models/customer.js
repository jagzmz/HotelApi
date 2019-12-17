'use strict';

module.exports = function(Customer) {
    Customer.validatesUniquenessOf('email',{message:"exist"})
};
