
class TimerBsw {

    constructor(viewPort, date, date2,  delay) {
        this.viewPort = viewPort;
        this.date1 = new Date(date);
        this.date2 = new Date(date2);
        this.delay = delay;
        this.timer_ = 0;
    }
    iniciar(){
        var that = this;
        that.date2.setMilliseconds( that.date2.getMilliseconds() + that.delay)
        this.timer_ = setInterval(function () {
            try {
                var msec = that.date2 - that.date1;
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                msec -= mm * 1000 * 60;
                var ss = Math.floor(msec / 1000);
                msec -= ss * 1000;
                let timeAgo = (that.delay < 86399999 ? (hh < 10 ? "0"+ hh : hh ): "") + 
                (that.delay < 3599999 ? ":" + (mm < 10 ? "0"+ mm : mm ): "") + 
                (that.delay < 59999 ? ":" + (ss < 10 ? "0"+ ss : ss ): "") + 
                (that.delay < 1000 ? ":" + (msec < 10 ? "0"+ msec : msec ): "");
    
                //document.getElementById(that.viewPort).innerHTML = timeAgo;
                $(that.viewPort).html( timeAgo);
                that.date2.setMilliseconds( that.date2.getMilliseconds() + that.delay)
            }
            catch(error) {
                console.error(error);
                clearInterval(that.timer_)
            }
            
        }, this.delay);
    }

    parar(){
        clearInterval(this.timer_)
        $(this.viewPort).html("");
    }

}