
(function () {
    //TODO: use notify instead passing view obj
    var Gaze = function (view, initX, initY) {
        var self = this;
        var TIMEOUT = 2000;
        self.x = initX;
        self.y = initY;
        self.timeoutToken = undefined;
        self.isLongGaze = false;        

        self.setGaze = function (x, y) {
            self.x = x;
            self.y = y;

            clearTimeout(self.timeoutToken);
            self.timeoutToken = setTimeout(function() {
                self.unsetGaze();
            }, TIMEOUT);

            
            view.setGaze(x, y);
            if(self.isLongGaze) {
                view.setLongGaze(x, y); 
            }  
        };

        self.getGaze = function () {
            return {
                x: self.x,
                y: self.y
            };
        };

        self.unsetGaze = function() {
            self.x = undefined;
            self.y = undefined;
            
            clearTimeout(self.timeoutToken);
            self.isLongGaze = false;

            view.unsetGaze();
        };

        self.setIsLongGaze = function(isLongGaze) {
            self.isLongGaze = isLongGaze;
        }
    };

    var View = function() {
        var self = this;

        var pointer = $('#gaze-pointer');
        var wallpaper = $('.wallpaper');
        var wallpaperOverlay = $('.wallpaper__overlay');

        self.setGaze = function(x, y) {
            wallpaper.addClass('wallpaper--zoom');
            wallpaper.css('background-position', x/wallpaper.width()*100 + '% ' + y/wallpaper.height()*100 + '%');

            pointer.css('left', x + 'px');
            pointer.css('top', y + 'px');
            pointer.show();
        };

        self.setLongGaze = function(x, y) {
            wallpaperOverlay.css('-webkit-mask-box-image', 'radial-gradient(circle at ' + x + 'px ' + y +'px, transparent 0, transparent 100px, black 200px)');
            wallpaperOverlay.show();
        };

        self.unsetGaze = function() {
            wallpaper.removeClass('wallpaper--zoom');
            pointer.hide();
            wallpaperOverlay.hide();
        }
    }

    var to2Digit = function(num) {
        return num < 10 ? '0' + num : num + '';
    } 

    //Init function
    var init = function() {
        //Init params
        var view = new View();
        var gaze = new Gaze(view, $('.wallpaper').width() / 2, $('.wallpaper').height() / 2); 

        const IMAGES = [
            'fall-1.jpg',
            'spring-1.jpg',
            'summer-1.jpg',
            'winter-1.jpg',
            'winter-2.jpg'
        ];
        
        //Init screen components
        const randImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
        $('.wallpaper').css('background-image', 'url("img/' + randImage + '")');

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
                        'night') + ', Erland.');


        //Register event callbacks
        $('#wallpaper').on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
            
            if($(this).hasClass('wallpaper--zoom')) {
                gaze.setIsLongGaze(true);
                $('.wallpaper__overlay').css('-webkit-mask-box-image', 'radial-gradient(circle at ' + gaze.getGaze().x + 'px ' + gaze.getGaze().y +'px, transparent 0, transparent 100px, black 200px)');
                $('.wallpaper__overlay').show();
            }
        });

        document.onmousemove = function(e) {
            var x = e.clientX;
            var y = e.clientY;
            
            gaze.setGaze(x, y);
        };
    }();
    
})();
