"use strict";
module.exports = (Model, options) => {
  
    

  Model.observe("before save", async function event(ctx, next) {
    
    if (ctx.isNewInstance) {
      if (ctx.data) {
        ctx.data.createdAt = ctx.currentInstance.createdAt || new Date();
        ctx.data.modifiedAt = new Date();
      }
      else{
        ctx.instance.createdAt =   new Date();
        ctx.instance.modifiedAt = new Date();
      }
    } else {
      if (ctx.instance) {
        ctx.instance.createdAt =
          (await Model.findOne({ where: { id: ctx.instance.id } })).createdAt ||
          new Date();
        ctx.instance.modifiedAt = new Date();
      }
    }
    next();
  });
};
