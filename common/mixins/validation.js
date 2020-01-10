"use strict";
module.exports = (Model, options) => {
  let customValidation = ["readOnly"];

  console.log(Model.definition.rawProperties);
  let properties = Model.definition.rawProperties;

  for (var s in properties) {
    var props = Object.keys(properties[s]);
    
    customValidation.forEach(cstmValidation=>{
        if(props.includes(cstmValidation)){
            console.log(cstmValidation)
        }
    })

  }
};
