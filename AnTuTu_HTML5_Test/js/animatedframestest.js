// Copyright (C) 2012 Orange
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
 
// animatedframestest.js

(function(){

// Test for UIPerfTest
if(!window.UIPerfTest){
    alert("Please include uiperftest.js before animatedframestest.js"); 
    return;
}

var self = window.AnimatedFramesTest = {
    frameWidth : 480,
    frameHeight : 480,
	frameNumber : 0,
    frames : new Array(),
    run : function (label,
                    prerequisites,
                    startCB,
                    stopCB) {
        document.addEventListener('DOMContentLoaded',
        function (evt) {
            UIPerfTest.run(label,prerequisites,startCB,stopCB);
        },
        false);
    },
    randomPositionFrame : function (frame) {
        frame.style['left']= Math.round((Math.random()*(UIPerfTest.contWidth-self.frameWidth)*0.9) + ((UIPerfTest.contHeight-self.frameHeight)*0.05) )+"px";
        frame.style['top']= Math.round((Math.random()*(UIPerfTest.contHeight-self.frameHeight)*0.9) + ((UIPerfTest.contHeight-self.frameHeight)*0.05) )+"px";
    },
    addColoredFrame : function () {
        var div= document.createElement("div");
        div.style['position'] = 'absolute';
        div.style['backgroundColor']= "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
        div.style['width']= self.frameWidth + "px";
        div.style['height']= self.frameHeight + "px";
        div.style[Modernizr.prefixed('transition')] = 'all 1s ease-in-out';
        self.randomPositionFrame(div);
        UIPerfTest.container.appendChild(div);
        self.frames.push(div);
    },
	addImageFrame : function (url) {
		self.frameWidth = Math.round((UIPerfTest.contWidth)/3);
		self.frameHeight = Math.round((UIPerfTest.contWidth)/3);
        var div= document.createElement("div");
        div.style['position'] = 'absolute';
		div.style['backgroundImage']= "url("+url+")";
		div.style['backgroundSize']= self.frameWidth + "px " + self.frameHeight + "px";
		div.style['backgroundRepeat']= "no-repeat";
        div.style['width']= self.frameWidth + "px";
        div.style['height']= self.frameHeight + "px";
        div.style[Modernizr.prefixed('transition')] = 'all 1s ease-in-out';
        self.randomPositionFrame(div);
        UIPerfTest.container.appendChild(div);
        self.frames.push(div);
    },
	addTextFrame : function (text) {
		self.frameNumber++;
		text= text ? text : "Text " + self.frameNumber + " in CSS3";
        var div= document.createElement("div");
        div.style['position'] = 'absolute';
        div.style['backgroundColor']= "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
        div.style['color']= "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
        div.style['padding']= "5px";
        div.style['fontSize']= "80px";
        div.style['fontWeight']= "bolder";
		div.style['verticalAlign']= "middle";
        div.style['width']= self.frameWidth + "px";
        div.style['height']= self.frameHeight + "px";
		div.innerHTML= text; 
        div.style[Modernizr.prefixed('transition')] = 'all 1s ease-in-out';
        self.randomPositionFrame(div);
        UIPerfTest.container.appendChild(div);
        self.frames.push(div);
    },
	addCarteFrame : function (big, number) {
		big = big ? big : false;
		number = number ? number : ((self.frameNumber++)%6);
		self.frameWidth = 194;
		self.frameHeight = 280;
		url = 'img/cards_small/card_'+ number +'.png'
        var div= document.createElement("div");
        div.style['position'] = 'absolute';
		div.style['backgroundImage']= "url("+url+")";
		div.style['backgroundRepeat']= "no-repeat";
        div.style['width']= self.frameWidth + "px";
        div.style['height']= self.frameHeight + "px";
        div.style[Modernizr.prefixed('transition')] = 'all 1s ease-in-out';
        self.randomPositionFrame(div);
        UIPerfTest.container.appendChild(div);
        self.frames.push(div);
    }
	
}

})();
