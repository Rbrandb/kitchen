odoo.define('kitchen_pos.PosScreen', function (require) {
  'use strict';

  const core = require('web.core');
  const _t = core._t;
  const Registries = require('point_of_sale.Registries');
  const ProductScreen = require('point_of_sale.ProductScreen');
  const NumberBuffer = require('point_of_sale.NumberBuffer');
  const models = require('point_of_sale.models');
  const _pos_model = models.PosModel.prototype;
  const pos_models = models.PosModel.prototype.models;
  const rpc = require('web.rpc');

  models.load_fields('product.product', ['food_type', 'food_temperature', 'food_serve_as', 'food_doneness', 'kitchen_option']);

  pos_models.push({
    model: 'product.serve.as',
    label: 'load_product_serve_as',
    fields: ['name'],
    loaded: function (self, product_serve_as) {
      self.product_serve_as = product_serve_as;
      self.db.add_food_serve_as(product_serve_as);
    }
  },
    {
      model: 'product.food.doneness',
      label: 'load_product_food_doneness',
      fields: ['name'],
      loaded: function (self, product_food_doneness) {
        self.product_food_doneness = product_food_doneness;
        self.db.add_food_doneness(product_food_doneness);
      }
    });

  models.PosModel = models.PosModel.extend({

    initialize: function (attributes) {
      _pos_model.initialize.call(this, attributes);
      this.product_serve_as = [];
      this.product_food_doneness = [];
    },

  });

  var _super_orderline = models.Orderline.prototype;

  models.Orderline = models.Orderline.extend({

    capitalize: function (string) {
      if (string === undefined || string === false || string === null) {
        return '';
      }
      else {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    },

    get_food_main_info: function () {
      var food_type = this.capitalize(this.product.food_type);
      var food_temperature = this.capitalize(this.product.food_temperature);
      var response = food_type + ' ' + food_temperature;
      return response;
    },

    get_food_secondary_info: function () {
      var food_serve_as = this.product.food_serve_as[1]
      var food_doneness = this.product.food_doneness[1]
      var response = '';
      if (food_serve_as) {
        response += String(food_serve_as);
      }
      if (food_doneness) {
        response += ', ' + String(food_doneness);
      }
      return response;
    },

  });

  return ProductScreen;

});