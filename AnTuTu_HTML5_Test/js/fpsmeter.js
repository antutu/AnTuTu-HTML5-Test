// Copyright (c) 2012 David Corvoysier http://www.kaizou.org
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// fpsmeter.js
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
 */
if(!window.Modernizr){

    Modernizr.prefixed = function(prop){
        return prop;
    };
}

(function(){

var transitionPropertyName = Modernizr.prefixed('transition');
var transitionEventName = null;
var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd',
      'msTransition'     : 'MSTransitionEnd',
      'transition'       : 'transitionend'
    },
transitionEventName = transEndEventNames[transitionPropertyName];

if(!transitionPropertyName){
    return;
}

// Use this to remmeber what method we use to calculate fps
var method = 'raf';

var requestAnimationFrame = null;
var cancelAnimationFrame = null;
// requestAnimationFrame polyfill by Erik MÃ¶ller
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function() {
    var lastTime = 0;
        requestAnimationFrame = Modernizr.prefixed('requestAnimationFrame', window);
        cancelAnimationFrame = Modernizr.prefixed('CancelAnimationFrame', window) || Modernizr.prefixed('CancelRequestAnimationFrame', window);

    if (!requestAnimationFrame)
        requestAnimationFrame = function(callback, element) {
            method = 'js';
            var currTime = new Date().getTime();
            // 16 ms is for a 60fps target
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!cancelAnimationFrame)
        cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var ref = null;
var values = null;
var startTime = null;
var frameID = null;
var totalFrame = 0;
var totalElapsed = 0;

var self = window.FPSMeter = {
    run : function(rate) {
        self.rate = rate ? rate : 1;
        if(document.readyState === 'complete') {
            var startIteration = function() {
                values = new Array();
                // Remember when we started the iteration
                startTime = new Date().getTime();
                if (ref.style.left == "0px") {
                    ref.style.left = self.bodyWidth + "px";
                } else {
                    ref.style.left = "0px";
                }
                if (window.mozPaintCount != undefined) {
                    method = 'native';
                    // Remember how many paints we had
                    frameID = window.mozPaintCount;
                } else {
                    // Define a function to repeatedly store reference
                    // x positions 
                    var storeValue = function () {
                        frameID = requestAnimationFrame(storeValue);
                        var l = GetFloatValueOfAttr(ref, 'left');
                        if(l){
                            values.push(l);
                        }
                    };
                    // Start storing positions right now
                    storeValue();
                }
            };
            if(!ref) {
                self.bodyWidth = GetFloatValueOfAttr(document.body,'width');
                ref = document.createElement("div");
                ref.setAttribute("id", "AnimBenchRef");
                ref.style['position'] = 'absolute';
                ref.style['backgroundColor'] = 'transparent';
                ref.style['width'] = '1px';
                ref.style['height'] = '1px';
                ref.style['left'] = '0px';
                ref.style['bottom'] = '0px';
                ref.style[transitionPropertyName] = 'all ' + self.rate + 's linear';
                var bodyRef = document.getElementsByTagName("body").item(0);
                bodyRef.appendChild(ref);
                var onTransitionEnd = function (evt) {
                    var frames = 0;
                    var elapsed = (new Date().getTime()) - startTime;
                    if (window.mozPaintCount != undefined) {
                        // We just count the number of paints that
                        // occured during the last iteration
                        frames = window.mozPaintCount - frameID;
                    } else {
                        // We will look at reference x positions 
                        // stored during the last iteration and remove 
                        // duplicates                        
                        cancelAnimationFrame(frameID);
                        var duplicates = 0;
                        var current = -1;
                        for (var i = 0; i < values.length; i++) {
                            var l = values[i];
                            if (l == current) {
                                duplicates++;
                            } else {
                                current = l;
                            }
                        }
                        frames = values.length - duplicates;
                    }
                    totalFrame += frames;
                    totalElapsed += elapsed;
                    var fps = Math.round(totalFrame*1000/totalElapsed*100)/100;
                    startIteration();
                    var evt = document.createEvent("Event");
                    evt.initEvent("fps",true,true); 
                    evt.fps = fps;
                    evt.method = method;
                    document.dispatchEvent(evt);
                };
                ref.addEventListener(transitionEventName,onTransitionEnd,false);
                if(transitionEventName != "webkitTransitionEnd") {
                    ref.addEventListener("webkitTransitionEnd",onTransitionEnd,false);
                }

            }
            setTimeout(
                function (evt) {
                    startIteration();
                },
                10);
        } else {
            setTimeout(
                function (evt) {
                    self.run(rate);
                },
                10);
        }
    },
    stop : function() {
        cancelAnimationFrame(frameID);
        frameID = null;
        var bodyRef = document.getElementsByTagName("body").item(0);
        bodyRef.removeChild(ref);
        ref = null;
    }

    

}

function GetFloatValueOfAttr (element,attr) {
    var floatValue = null;
    if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle (element, null);
        try {
            var value = compStyle.getPropertyCSSValue (attr);
            var valueType = value.primitiveType;
            switch (valueType) {
              case CSSPrimitiveValue.CSS_NUMBER:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_NUMBER);
                  break;
              case CSSPrimitiveValue.CSS_PERCENTAGE:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PERCENTAGE);
                  alert ("The value of the width property: " + floatValue + "%");
                  break;
              default:
                  if (CSSPrimitiveValue.CSS_EMS <= valueType && valueType <= CSSPrimitiveValue.CSS_DIMENSION) {
                      floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  }
            }
        } 
        catch (e) {
          // Opera doesn't support the getPropertyCSSValue method
          stringValue = compStyle[attr];
          floatValue = stringValue.substring(0, stringValue.length - 2);
        }
    }
    return floatValue;
}

})();