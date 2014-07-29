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
 
// uiperftest.js


(function(){

// Test for Modernizr
if(!window.Modernizr){
    alert("This test page doesn't seem to include Modernizr: aborting"); 
    return;
}

var self = window.UIPerfTest = {
    contWidth : 480,
    contHeight : 600,
    run : function (label,
                    prerequisites,
                    startCB,
                    stopCB,
                    duration,
                    targetFPS,
                    maxIterations) {
        // Test for test-specific prerequisites using Modernizr
        if(prerequisites && prerequisites.length){
            for(var index in prerequisites){
                if(!Modernizr[prerequisites[index]]){
                    test(function(){assert_true(false);},prerequisites[index]+" not supported");
                    return;
                }
            }
        }
        // Our main test function
        var runTest = function(index) {
            fps = new Array();
            var averageArray = function(arr) {
                var avg = arr[0];
                for (var i = 1; i < arr.length; i++) {
                    avg += arr[i];
                }
                avg = Math.round(avg/arr.length);
                return avg;
            } 
            setTimeout(
                function(){
                    stopCB();
                    var avgfps = averageArray(fps);
					self.container.innerHTML = "";

                    // We're done with this test run
                    for (var i=index+1;i<=maxIterations;i++) {
                        tests[i].step(function(){assert_true(false,"Not run due to failure at previous iteration.")});
                        tests[i].done();
                    }
                    done();
                    var main = document.getElementById('main');
                    main.removeChild(self.container);
                },duration*1000);
            startCB(index);
        };
        
        var startIndex = 6;

        // Start here
        var fps = null;
        var tests = new Array();
                
        // Assign default values if needed
        duration = duration ? duration : 10;
        targetFPS = targetFPS ? targetFPS : 240;
        maxIterations = maxIterations ? maxIterations : startIndex;

        setup(function(){},{timeout:(duration+1)*maxIterations*1000});
        // Start test run
        runTest(startIndex);
    }
};

// Create test page layout 
document.addEventListener('DOMContentLoaded',
                          function (evt) {
                            // Create the page structure
                            var main = document.createElement('div');
                            main.id = 'main';
                            
                            self.container = document.createElement('div');
                            self.container.id = 'container';
                            self.container.style['width'] = self.contWidth + 'px';
                            self.container.style['height'] = self.contHeight + 'px';
                            self.container.style['position'] = 'absolute';
                            self.container.style['top'] = '100px';
                            self.container.style['marginLeft'] = 'auto';
                            self.container.style['marginRight'] = 'auto';
                            self.container.style['overflow'] = 'hidden';
                            main.appendChild(self.container);
                            
                            document.body.appendChild(main);
                          },
                          false);

})();
