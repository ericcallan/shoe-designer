import React, { Component } from 'react';

class PolygonaAnimator extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
      this.setState({hits: this.props.hits});
      this.onLoad()
    }

    componentWillReceiveProps(nextProps) {
        document.getElementById('bg').innerHTML = "";
      
        setTimeout(() => {
          this.onLoad()
        },1);
    }

    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
    }
    
    getRandomInt(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    onLoad() {
      let multiplier = 0;

      if(this.props.hits >= 0) {
        multiplier = this.props.hits;
      }

      let refreshDuration = 10000;
      let refreshTimeout;
      let numPointsX;
      let numPointsY;
      let unitWidth;
      let unitHeight;
      let points;

      console.log('window.innerWidth');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width',window.innerWidth);
      svg.setAttribute('height',window.innerHeight);
      document.querySelector('#bg').appendChild(svg);

      var unitSize = (window.innerWidth+window.innerHeight)/20;
      numPointsX = (Math.ceil(window.innerWidth/unitSize)+1) * 3;
      numPointsY = (Math.ceil(window.innerHeight/unitSize)+1) * 3;
      unitWidth = Math.ceil(window.innerWidth/(numPointsX-1));
      unitHeight = Math.ceil(window.innerHeight/(numPointsY-1));

      points = [];

      numPointsX = 100;

      for(var y = 0; y < numPointsY; y++) {
          for(var x = 0; x < numPointsX; x++) {
              points.push({x:unitWidth*x, y:unitHeight*y, originX:unitWidth*x, originY:unitHeight*y});
          }
      }

      for(var i = 0; i < points.length; i++) {
        let randX = this.getRandomInt(0, multiplier) / 40;
        let randY = this.getRandomInt(0, multiplier) / 40;

        if(points[i].originX != 0 && points[i].originX != unitWidth*(numPointsX-1)) {
            points[i].x = points[i].originX + randX * unitWidth-unitWidth/2;
        }
        if(points[i].originY != 0 && points[i].originY != unitHeight*(numPointsY-1)) {
            points[i].y = points[i].originY + randY * unitHeight-unitHeight/2;
        }
      }


      for(var i = 0; i < points.length; i++) {
          if(points[i].originX != unitWidth*(numPointsX-1) && points[i].originY != unitHeight*(numPointsY-1)) {
              var topLeftX = points[i].x;
              var topLeftY = points[i].y;
              var topRightX = points[i+1].x;
              var topRightY = points[i+1].y;
              var bottomLeftX = points[i+numPointsX].x;
              var bottomLeftY = points[i+numPointsX].y;
              var bottomRightX = points[i+numPointsX+1].x;
              var bottomRightY = points[i+numPointsX+1].y;


              var rando = Math.floor(Math.random()*2);

              for(var n = 0; n < 2; n++) {
                  var polygon = document.createElementNS(svg.namespaceURI, 'polygon');

                  if(rando==0) {
                      if(n==0) {
                          polygon.point1 = i;
                          polygon.point2 = i+numPointsX;
                          polygon.point3 = i+numPointsX+1;
                          polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+bottomRightX+','+bottomRightY);
                      } else if(n==1) {
                          polygon.point1 = i;
                          polygon.point2 = i+1;
                          polygon.point3 = i+numPointsX+1;
                          polygon.setAttribute('points',topLeftX+','+topLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                      }
                  } else if(rando==1) {
                      if(n==0) {
                          polygon.point1 = i;
                          polygon.point2 = i+numPointsX;
                          polygon.point3 = i+1;
                          polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY);
                      } else if(n==1) {
                          polygon.point1 = i+numPointsX;
                          polygon.point2 = i+1;
                          polygon.point3 = i+numPointsX+1;
                          polygon.setAttribute('points',bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                      }
                  }
                  polygon.setAttribute('fill',`rgba(${this.hexToRgb("#" + this.props.secondaryColor)},${Math.random()/3}`);
                  svg.appendChild(polygon);
              }
          }
        }

    }


    render() {
        return <div id="bg"></div>
    }
}

export default PolygonaAnimator;