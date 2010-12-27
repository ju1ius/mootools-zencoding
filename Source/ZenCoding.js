/*
---
name: ZenCoding
description:  Wraps zen_parser to generate Elements from zen-coding abbreviations.

license: MIT-style

authors: Jules Bernable

requires:
- 'core/1.3:Element'
- 'http://github.com/sergeche/zen-coding/blob/master/javascript/zen_parser.js'

provides:
- ZenCoding
- Element.expandAbbreviation
- String.expandAbbreviation

...
*/
(function()
{
  var unary_tags = [
    'area','base','basefont','br','col','frame','hr','img','input',
    'isindex','link','meta','param','embed','keygen','command'
  ];
  var is_empty = function(tag)
  {
    return unary_tags.contains(tag.name);
  };
  var indent = function(depth)
  {
    return new Array(depth+1).join('  ');
  };

  var zen_node_to_el = function(node)
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
        parent.adopt(zen_node_to_el(children[j]));
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
  }; 

  var zen_node_to_html = function(node, depth)
  {
    var str = indent(depth) + '<' + node.name,
      attrs = node.attributes, al = attrs.length,
      u = is_empty(node);
    
    for (var i = 0; i < al; i++)
    {
      var attr = attrs[i];
      str += ' ' + attr.name +'="' + attr.value + '"';
    }
    str += (u?'/':'') + '>' + (u?"\n":'');
    if(!u)
    {   
      var t = node.text, children = node.children, cl = children.length;
      if(t) str +=  "\n" + indent(depth+1) + node.text + "\n";
      if(cl)
      {
        if(!t) str += "\n";
        for(var j = 0; j < cl; j++)
        {
          str += zen_node_to_html(children[j], depth+1);
        }
      }
      str += (t||cl?indent(depth):'') + '</'+node.name+'>' + "\n";
    }
    if(node.count > 1)
    {
      var clone = str;
      for (var k = 0; k < node.count - 1; k++)
      {
        str += clone;
      };
    } 
    return str;
  };

  ZenCoding = {};

  ZenCoding.abbrToElements = function(abbr)
  {
    var els = new Elements(), zen_tree = zen_parser.parse(abbr),
      children = zen_tree.children, l = children.length;
    for (var i = 0; i < l; i++)
    {
      els.push(zen_node_to_el(children[i]));
    };
    return els;
  },
  ZenCoding.abbrToHtml = function(abbr)
  {
    var html = '', zen_tree = zen_parser.parse(abbr),
      children = zen_tree.children, l = children.length;
    
    for (var i = 0; i < l; i++)
    {
      html += zen_node_to_html(children[i], 0);
    };
    return html;
  }

})();

Element.implement({
  expandAbbreviation: function(abbr)
  {
    this.adopt(ZenCoding.abbrToElements(abbr));
  }
});

String.expandAbbreviation = function(abbr)
{
  return ZenCoding.abbrToHtml(abbr);
}