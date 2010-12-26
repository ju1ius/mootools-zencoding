mootools-zencoding
==================

Wraps zen_parser to generate Elements from zen-coding abbreviations.

How to use
----------

    var abbr = 'table>(thead>tr>th{Row Header}*4)+(tfoot>tr>td[colspan=4])+(tbody>tr*4>td{Cell...}*4)';
    
    // Parse abbreviation and injects the resulting elements
    $('my-element').expandAbbreviation(abbr);
    // Or return an Elements object containing the generated elements
    var els = ZenCoding.abbrToElements(abbr);
    
    // Parse abbreviation into an HTML string
    var html = String.expandAbbreviation(abbr);
    // Or
    var html = ZenCoding.abbrToHtml(abbr);