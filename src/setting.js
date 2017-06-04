
var SettingLayer = cc.Layer.extend({
    sprite:null,
    setting: null,
    ctor:function (setting) {
        this._super();
        var size = cc.winSize;

        this.setting = setting;
        //cc.log("this.setting:gn:" + this.setting.gn);
        var title = new cc.LabelTTF("Setting","",36);
        title.attr({
            x: size.width / 2,
            y: size.height *9 / 10
        });
        this.addChild(title);

        this.initMenu();

        return true;
    },

    initMenu: function () {
        var item1 = new cc.MenuItemFont("2",this.setG2,this);
        var item2 = new cc.MenuItemFont("3",this.setG3,this);
        var item3 = new cc.MenuItemFont("4",this.setG4,this);
        var item4 = new cc.MenuItemFont("5",this.setG5,this);

        var menu = new cc.Menu(item1, item2, item3, item4);
        menu.alignItemsVertically();
        this.addChild(menu);
    },

    setG2: function () {
        this.setting.gn = 2;
        cc.director.popScene();
    },
    setG3: function () {
        this.setting.gn = 3;
        cc.director.popScene();
    },
    setG4: function () {
        this.setting.gn = 4;
        cc.director.popScene();
    },
    setG5: function () {
        this.setting.gn = 5;
        cc.director.popScene();
    },



});

var SettingScene = cc.Scene.extend({
    ctor: function (setting) {
        this._super();

        //cc.log("GN = " + setting.gn);
        var layer = new SettingLayer(setting);
        this.addChild(layer);
    },
    // onEnter:function () {
    //     this._super();
    //     var layer = new SettingLayer();
    //     this.addChild(layer);
    // }
});

