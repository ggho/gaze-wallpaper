
(function () {
    var Gaze = function (initX, initY) {
        var self = this;
        const TIMEOUT = 2000;
        self.x = initX;
        self.y = initY;
        self.timeoutToken;

        var pointer = $('#gaze-pointer');
        var wallpaper = $('#wallpaper');


        self.setGaze = function (x, y) {
            self.x = x;
            self.y = y;

            clearTimeout(self.timeoutToken);
            self.timeoutToken = setTimeout(function() {
                self.x = undefined;
                self.y = undefined;

                //TODO: use notify
                wallpaper.removeClass('wallpaper--zoom');
                pointer.hide();
            }, TIMEOUT);

            //TODO: use notify 
            wallpaper.addClass('wallpaper--zoom');
            wallpaper.css('background-position', x/wallpaper.width()*100 + '% ' + y/wallpaper.height()*100 + '%');

            pointer.css('left', x + 'px');
            pointer.css('top', y + 'px');
            pointer.show();
        }
        self.getGaze = function () {
            return {
                x: self.x,
                y: self.y
            }
        }
    }

    //Init function
    var init = function() {
        var wallpaper = document.getElementById('wallpaper');
        var gaze = new Gaze(wallpaper.width / 2, wallpaper.height / 2);

        var gazerIsOn = undefined;
        // webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //     .setTracker('clmtrackr')
        //     .setGazeListener(function(data, clock) {
        //         if (data == null) {
        //             return;
        //         }
        //         var xprediction = data.x; //these x coordinates are relative to the viewport 
        //         var yprediction = data.y; //these y coordinates are relative to the viewport
        //         console.log(xprediction + ', ' + yprediction); //elapsed time is based on time since begin was called
        //         // gaze.setGaze(xprediction, yprediction);
        //     })
        //     .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

        // webgazer.setGazeListener(function (data, elapsedTime) {
        //     if (data == null) {
        //         return;
        //     }
        //     var xprediction = data.x; //these x coordinates are relative to the viewport 
        //     var yprediction = data.y; //these y coordinates are relative to the viewport
        //     console.log(xprediction + ', ' + yprediction); //elapsed time is based on time since begin was called
        //     gaze.setGaze(xprediction, yprediction);
        // });

        //Register event callbacks
        document.onmousemove = function(e) {
            var x = e.clientX;
            var y = e.clientY;
            
            gaze.setGaze(x, y);
        };

        document.onkeypress = function (e) {
            if (e.keyCode == 32) {
                if (gazerIsOn === undefined) {
                    window.localStorage.clear();
                    webgazer.begin()
                } else if (gazerIsOn) {
                    webgazer.pause();
                } else {
                    webgazer.resume();
                }
                gazerIsOn = !gazerIsOn;

            }
        };
    }();






})();
