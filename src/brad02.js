var Brad02Layer = cc.Layer.extend({
    dx: 2,
    nums: new Array(10),
    rects: new Array(10),
    back: null,
    home: null,
    enter: null,
    mesg : null,
    winner:null,
    loser : null,
    input : null,
    counter : 0,
    inputString: '',    // string var
    answer : createAnswer(),
    setting: null,
    ctor: function (setting) {
        this._super();
        var size = cc.winSize;

        this.setting = setting;
        this.answer = createAnswer(this.setting.gn);
        cc.log("answer: " + this.answer);

        var myTitle = new cc.LabelTTF("猜數字遊戲", "Arial", 48);
        myTitle.x = size.width / 2;
        myTitle.y = size.height * 7 / 8;
        myTitle.setColor(cc.color(255, 255, 0));
        this.addChild(myTitle, 0, "myTitle");

        this.initSprit();
        this.mymouseListener(this);
        this.scheduleUpdate();

        //cc.log(this.answer);

        return true;
    },

    initSprit: function () {
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(
            res.number_plist, res.number_png);
        for (i = 0; i < this.nums.length; i++) {
            this.nums[i] = new cc.Sprite("#number" + i + ".png");
            var px, py;
            if (i == 0) {
                px = 2;
                py = 1;
            } else {
                px = (i - 1) % 3 + 2;
                py = parseInt((i - 1) / 3) + 2;
            }
            this.nums[i].attr({
                x: cc.winSize.width * px / 6,
                y: cc.winSize.height * py / 8
            });
            this.addChild(this.nums[i]);

            // 順便取得各Sprite的範圍區域
            this.rects[i] = new cc.Rect(
                this.nums[i].x-this.nums[i].width/2,
                this.nums[i].y-this.nums[i].height/2,
                this.nums[i].width,
                this.nums[i].height);

        }

        this.back = new cc.Sprite(res.back_png);
        this.back.attr({
            x: cc.winSize.width * 3 / 6,
            y: cc.winSize.height * 1 / 8
        });
        this.addChild(this.back);

        this.home = new cc.Sprite(res.back_png);
        this.home.attr({
            x: cc.winSize.width * 5 / 6,
            y: cc.winSize.height * 1 / 8
        });
        this.addChild(this.home);

        this.enter = new cc.Sprite(res.enter_png);
        this.enter.attr({
            x: cc.winSize.width * 4 / 6,
            y: cc.winSize.height * 1 / 8
        });
        this.addChild(this.enter);

        this.input = new cc.LabelTTF("","",48);
        this.input.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height *6/8
        });
        this.addChild(this.input);

        this.mesg = new cc.LabelTTF("輸入三位數","",48);
        this.mesg.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height *5/8
        });
        this.addChild(this.mesg);

        this.winner = new cc.Sprite(res.winner_png);
        this.winner.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.addChild(this.winner);
        this.winner.setVisible(false);

        this.loser = new cc.Sprite(res.loser_png);
        this.loser.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.addChild(this.loser);
        this.loser.setVisible(false);

    },

    mymouseListener: function(layer){
        if ('mouse' in cc.sys.capabilities){
            // mouse listener
            var mouseListener = {
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    var x = event.getLocationX();
                    var y = event.getLocationY();
                    var point = new cc.Point(x,y);

                    // <home>
                    var rectHome = new cc.Rect(layer.home.x-layer.home.width/2,
                        layer.home.y-layer.home.height/2,
                        layer.home.width,
                        layer.home.height);
                    if (cc.rectContainsPoint(rectHome, point)){
                        cc.director.popScene();
                        return;
                    }

                    if (layer.inputString.length>0){
                        // <back>
                        var rect = new cc.Rect(layer.back.x-layer.back.width/2,
                            layer.back.y-layer.back.height/2,
                            layer.back.width,
                            layer.back.height);



                        if (cc.rectContainsPoint(rect, point)){
                            //
                            cc.log("back");
                            layer.inputString =
                                layer.inputString.substr(0,layer.inputString.length-1);
                            layer.input.setString(layer.inputString);

                            layer.input.setColor(cc.color(255,255,255));

                            return;
                        }
                    }

                    if (layer.inputString.length==3){
                        // <enter>
                        var rect = new cc.Rect(layer.enter.x-layer.enter.width/2,
                            layer.enter.y-layer.enter.height/2,
                            layer.enter.width,
                            layer.enter.height);
                        if (cc.rectContainsPoint(rect, point)) {
                            var result = checkAB(layer.answer, layer.inputString);
                            layer.mesg.setString(result);
                            layer.counter++;

                            if (result === "3A0B") {
                                layer.winner.setVisible(true);
                            }else if (layer.counter == 10){
                                layer.loser.setVisible(true);
                            }else{
                                layer.input.setColor(cc.color(255,255,255));
                                layer.inputString = '';
                                layer.input.setString(layer.inputString);
                            }
                        }
                    }else{
                        // 此處判斷是否輸入數字鍵
                        for (i=0; i<layer.rects.length; i++){
                            if (cc.rectContainsPoint(layer.rects[i], point) &&
                                layer.inputString.indexOf(''+i)==-1){
                                layer.inputString += i;
                                layer.input.setString(layer.inputString);
                                break;
                            }
                        }
                        if (layer.inputString.length==3){
                            layer.input.setColor(cc.color(255,0,0));
                        }
                    }




                }
            };
            cc.eventManager.addListener(mouseListener,this);
        }
    },

    update: function () {
        var myTitle = this.getChildByName("myTitle");
//        var myTitle = this.getChildByTag(123);
        if (myTitle.x + myTitle.width / 2 >= cc.winSize.width ||
            myTitle.x - myTitle.width / 2 <= 0) {
            this.dx *= -1
        }
        myTitle.x += this.dx;
    }
});

var Brad02Scene = cc.Scene.extend({
    ctor: function (setting) {
        this._super();

        var layer = new Brad02Layer(setting);
        this.addChild(layer);
    },
    // onEnter: function () {
    //     this._super();
    //     var layer = new Brad02Layer();
    //     this.addChild(layer);
    // }
});

function checkAB(ans, guess) {
    var a, b; a= b = 0;
    for (i=0;i<ans.length; i++){
        if (guess.charAt(i) == ans.charAt(i)){
            a++;
        }else if (ans.indexOf(guess.charAt(i)) !== -1){
            b++;
        }
    }
    return a + "A" + b +"B";
}
function createAnswer(d) {
    var n = [0,1,2,3,4,5,6,7,8,9];
    n = shuffle(n);

    var ret = "";
    for (i=0; i<d; i++){
        ret += n[i];
    }

    return ret;
}
function myLottery(){
    var n = new Array(49);
    for (i=0; i<n.length; i++){
        n[i] = i+1;
    }
    n = shuffle(n);
    return '' + n[0] + ',' +n[1] + ','+ n[2] + ','+ n[3] + ','+ n[4] + ','+ n[5];

}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = parseInt(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}