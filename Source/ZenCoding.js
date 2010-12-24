ZenCoding = {
  expand: function(abbr)
  {
    var r = [], zen_tree = zen_parser.parse(abbr),
      children = zen_tree.children, l = children.length;
    for (var i = 0; i < l; i++)
    {
      r.push(this.parse_zen_node(children[i]));
    };
    return r;
  },
  parse_zen_node: function(node)
  {
    var opts = {},
      attrs = node.attributes, al = attrs.length;
    for (var i = 0; i < al; i++)
    {
      var attr = attrs[i];
      opts[attr.name] = attr.value;
    }
    if( node.text ) opts['text'] = node.text;
    var parent = new Element(node.name, opts);
    var children = node.children, cl = children.length;
    if(cl)
    {
      for(var j = 0; j < cl; j++)
      {
        parent.adopt(this.parse_zen_node(children[j]));
      }
    }
    if(node.count > 1)
    {
      var els = [];
      for (var k = 0; k < node.count; k++)
      {
        els.push(parent.clone());
      };
      return els
    }
    return parent;
  } 
};
Element.implement({
  expandAbbreviation: function(abbr)
  {
    this.adopt(ZenCoding.expand(abbr));
  }
});
