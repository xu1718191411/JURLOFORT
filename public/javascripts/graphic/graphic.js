/**
 * Created by xuzhongwei on 15/11/14.
 */
function graphic(id){
    this.svg = d3.select("#d3Svg");
}


graphic.prototype.drawCircle = function(cx,cy,r,options){
    _svg = this.svg;
    var circle = _svg.append("circle");
    circle.attr("cx",cx);
    circle.attr("cy",cy);
    circle.attr("r",r);
    circle.attr("fill","blue");
    circle.attr("stroke","orange");
    circle.attr("stroke-width",5);
}



graphic.prototype.drawEllipse = function(cx,cy,rx,ry){
    _svg = this.svg;
    var ellipse = _svg.append("ellipse");
    ellipse.attr("cx",cx);
    ellipse.attr("cy",cy);
    ellipse.attr("rx",rx);
    ellipse.attr("ry",ry);
    ellipse.attr("stroke","orange");
    ellipse.attr("stroke-width",5);
}

graphic.prototype.drawLine = function(x1,y1,x2,y2,color){
    _svg = this.svg;
    var line = _svg.append("line");
    line.attr("x1",x1);
    line.attr("y1",y1);
    line.attr("x2",x2);
    line.attr("y2",y2);
    line.attr("stroke",color)
}
