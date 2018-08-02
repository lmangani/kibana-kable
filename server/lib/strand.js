var _ = require('lodash');

module.exports = function Strand (name, config) {
  this.name = name;

  // Consider making args optional and allowing functions to implement their own parsers
  // as long as they don't conflict with ours?

  this.args = config.args || {};
  this.args.byName = _.indexBy(this.args, 'name');
  this.help = config.help || '';

  /*
    You are strongly urged to modify the input object
    vs constructing a new object if returning the same object type.

    This is not enforced, but you're going to annoy a lot of folks if you go
    around dropping their _render property.
  */
  this.fn = config.fn;
};
