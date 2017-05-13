
(function () {
    var Gaze = function (initX, initY) {
        var self = this;
        var TIMEOUT = 2000;
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

    var to2Digit = function(num) {
        return num < 10 ? '0' + num : num + '';
    } 

    //Init function
    var init = function() {
        //Init params
        var gaze = new Gaze(wallpaper.width / 2, wallpaper.height / 2);
        const IMAGES = [
            'fall-1.jpg',
            'spring-1.jpg',
            'summer-1.jpg',
            'winter-1.jpg',
            'winter-2.jpg'
        ];
        
        //Init screen components
        const randImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
        $('#wallpaper').css('background-image', 'url("img/' + randImage + '")');

        //
        const now = new Date();
        $('#time').text(now.getHours() + ':' + to2Digit(now.getMinutes()));
        
        $('#greeting').text('Good ' + 
            (now.getHours() < 12 ? 
                'morning'
                :
                now.getHours() < 18 ?
                    'afternoon'
                    :
                    now.getHours() < 22 ?
                        'evening'
                        :
                        'night') + ', you.');


        //Register event callbacks
        document.onmousemove = function(e) {
            var x = e.clientX;
            var y = e.clientY;
            
            gaze.setGaze(x, y);
        };
    }();






})();
