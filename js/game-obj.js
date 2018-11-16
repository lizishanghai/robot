var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameElement = /** @class */ (function () {
    function GameElement(className) {
        if (className === void 0) { className = "noclass"; }
        this.dom = null;
        this.isLive = true;
        this.init(className);
    }
    GameElement.prototype.init = function (className) {
        this.dom = document.createElement("div");
        this.dom.className = className;
    };
    return GameElement;
}());
var Animatables = /** @class */ (function (_super) {
    __extends(Animatables, _super);
    function Animatables() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        //敌机横向移动速度
        _this_1.movepx = 6;
        //敌机纵向移动速度
        _this_1.movepy = 4;
        //敌机移动频率
        _this_1.movesp = 75;
        return _this_1;
    }
    return Animatables;
}(GameElement));
var Movable = /** @class */ (function (_super) {
    __extends(Movable, _super);
    function Movable() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        //是否移动中
        _this_1.isMove = false;
        //移动的ID
        _this_1.moveId = null;
        //游戏背景Dom
        _this_1.gamePanel = null;
        //游戏背景宽度
        _this_1.gameWidth = 0;
        //游戏背景高度
        _this_1.gameHeight = 0;
        //飞机移动速度
        _this_1.movepx = 10;
        _this_1.movepy = 0;
        //飞机移动频率
        _this_1.movesp = 30;
        //方向键值对应
        _this_1.keyCodeAndDirection = {
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            65: "left",
            87: "up",
            68: "right",
            83: "down"
        };
        return _this_1;
    }
    return Movable;
}(GameElement));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(className) {
        if (className === void 0) { className = "enemy"; }
        var _this_1 = _super.call(this, className) || this;
        _this_1.movespMap = {
            1: 75,
            2: 65,
            3: 50,
            4: 40
        };
        return _this_1;
    }
    //设置敌机初始位置,x与y坐标
    Enemy.prototype.setPosition = function (x, y) {
        this.dom.style.left = x + "px";
        this.dom.style.top = y + "px";
    };
    //敌机动画，就是移动，传入参数为游戏背景的宽与高
    Enemy.prototype.animation = function (gameWidth, gameHeight) {
        var _this = this, 
        //实际的横向移动速度，左或者右
        _movepx = this.dom.offsetLeft > gameWidth / 2 ? -1 * this.movepx : this.movepx;
        //处理移动函数
        var process = function () {
            //敌机的x,y坐标
            var left = _this.dom.offsetLeft, top = _this.dom.offsetTop;
            //向右移动
            if (_movepx > 0) {
                left =
                    left + _movepx >= gameWidth - _this.dom.clientWidth
                        ? gameWidth - _this.dom.clientWidth
                        : left + _movepx;
            }
            //向左移动
            else {
                left = left + _movepx <= 0 ? 0 : left + _movepx;
            }
            //是否要掉转方向
            if (left <= 0 || left >= gameWidth - _this.dom.clientWidth) {
                _movepx *= -1;
            }
            //向下移动
            top =
                top + _this.movepy >= gameHeight - _this.dom.clientHeight
                    ? gameHeight - _this.dom.clientHeight
                    : top + _this.movepy;
            //设置敌机位置
            _this.dom.style.top = top + "px";
            _this.dom.style.left = left + "px";
            //判断是否撞到飞机玩家
            var isCrash = _this.OnCheckCrash();
            //判断是否飞到尽头，是否活着，是否撞到飞机玩家
            if (top < gameHeight - _this.dom.clientHeight &&
                _this.isLive &&
                !isCrash) {
                //继续移动
                setTimeout(process, _this.movesp);
            }
            else {
                //敌机死了而且没撞到飞机玩家
                if (!_this.isLive && !isCrash)
                    //爆炸
                    _this.effect();
                //敌机撞到飞机玩家
                else {
                    //爆炸
                    _this.effect();
                    //游戏结束
                    setTimeout(function () {
                        _this.gameover();
                    }, 100);
                }
            }
        };
        //开始移动
        process();
    };
    //敌机爆炸
    Enemy.prototype.effect = function () {
        this.dom.className = "bingo";
        var _this = this;
        setTimeout(function () {
            _this.onend();
        }, 50);
    };
    //外部接口，检测是否撞到飞机玩家
    Enemy.prototype.OnCheckCrash = function () { };
    //敌机结束事件
    Enemy.prototype.onend = function () { };
    //游戏结束
    Enemy.prototype.gameover = function () { };
    return Enemy;
}(Animatables));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(className) {
        if (className === void 0) { className = "bullet"; }
        var _this_1 = _super.call(this, className) || this;
        //子弹移动速度
        _this_1.movepx = 8;
        //子弹移动频率
        _this_1.movesp = 10;
        return _this_1;
    }
    //设置子弹初始位置
    //flyerinfo = {left:1,top:1,width:1,position:1,level:1}
    Bullet.prototype.setPosition = function (flyerinfo) {
        //子弹在飞机的中点位置
        var center = flyerinfo.left + (flyerinfo.width - this.dom.clientWidth) / 2, 
        //偏移量
        offset = 0;
        //设置第几发子弹
        flyerinfo.position =
            flyerinfo.level % 2 != 0 ? flyerinfo.position : flyerinfo.position + 1;
        //计算偏移量
        offset =
            flyerinfo.position % 2 != 0
                ? (flyerinfo.position / 2) * this.dom.clientWidth
                : (flyerinfo.position / 2) * this.dom.clientWidth * -1;
        //设置子弹位置
        this.dom.style.left = center + offset + "px";
        this.dom.style.top = flyerinfo.top - this.dom.clientHeight + "px";
    };
    //子弹动画，移动
    Bullet.prototype.animation = function () {
        var _this = this;
        //处理移动函数
        var process = function () {
            var top = _this.dom.offsetTop;
            top = top - _this.movepx >= 0 ? top - _this.movepx : 0;
            _this.dom.style.top = top + "px";
            //判断是否移动到尽头，是否击中敌机
            if (top > 0 && !_this.checkBeat()) {
                setTimeout(process, _this.movesp);
            }
            else {
                _this.onend();
            }
        };
        process();
    };
    //外部接口，是否击中敌机
    Bullet.prototype.checkBeat = function () { };
    //外部接口，子弹结束事件
    Bullet.prototype.onend = function () { };
    return Bullet;
}(Animatables));
var Flyer = /** @class */ (function (_super) {
    __extends(Flyer, _super);
    function Flyer(className) {
        if (className === void 0) { className = "flyer"; }
        var _this_1 = _super.call(this, className) || this;
        //是否发弹中
        _this_1.isSend = false;
        //目前已经发了多少颗弹(存在屏幕显示)
        _this_1.nowBullet = 0;
        //飞机子弹级别
        _this_1.bulletLevel = 1;
        //最大发弹数(存在屏幕显示)
        _this_1.maxBullet = 12;
        return _this_1;
    }
    //设置位置
    Flyer.prototype.setPosition = function (gamePanel, width, height) {
        // console.log('flyer: set position')
        //将飞机添加进游戏背景中
        this.gamePanel = gamePanel;
        this.gamePanel.appendChild(this.dom);
        //设置飞机的初始位置
        this.dom.style.left = (width - this.dom.clientWidth) / 2 + "px";
        this.dom.style.top = height - this.dom.clientHeight + "px";
        //获取到游戏背景的宽和高
        this.gameWidth = width;
        this.gameHeight = height;
        // console.log( this.dom.style.left + '' + this.dom.style.top)
    };
    //键盘按下事件
    Flyer.prototype.keydown = function (e) {
        var keyCode = e.keyCode;
        // console.log('flyer: keydown... ', e.keyCode);
        //按了空格发弹
        if (keyCode == 32) {
            //判断是否发弹中
            if (!this.isSend) {
                //发弹
                // console.log('flyer: ready to send')
                this.onSendBullet();
                this.isSend = true;
            }
        }
        else if (keyCode == 76) {
            //判断是否发弹中
            if (!this.isSend) {
                //发弹
                // console.log('flyer: ready to send')
                this.onSendBullet();
                this.isSend = true;
            }
        }
        //判断是否移动中，移动
        else if (!this.isMove) {
            this.move(keyCode);
        }
    };
    //键盘释放事件
    Flyer.prototype.keyup = function (e) {
        //判断是否为键盘释放
        // if(e.keyCode in [37, 38, 39, 40]){
        if (this.keyCodeAndDirection[e.keyCode]) {
            //停止移动
            // console.log('stop move');
            this.stopMove();
        }
        //发弹键释放
        else if (e.keyCode == 32 || e.keyCode == 76) {
            //设置为非发弹中
            // console.log('Not send bullet')
            this.isSend = false;
        }
    };
    //移动
    Flyer.prototype.move = function (keyCode) {
        //设置为移动中
        this.isMove = true;
        var _this = this;
        //判断移动方向
        switch (this.keyCodeAndDirection[keyCode]) {
            case "left": {
                this.moveId = setInterval(function () {
                    _this.moveLeftUp("left");
                }, _this.movesp);
                break;
            }
            case "up": {
                this.moveId = setInterval(function () {
                    _this.moveLeftUp("up");
                }, _this.movesp);
                break;
            }
            case "right": {
                this.moveId = setInterval(function () {
                    _this.moveRightDown("right");
                }, _this.movesp);
                break;
            }
            case "down": {
                this.moveId = setInterval(function () {
                    _this.moveRightDown("down");
                }, _this.movesp);
                break;
            }
            default:
                break;
        }
    };
    //左或上移动
    Flyer.prototype.moveLeftUp = function (direction) {
        var leftOrUp = this.dom[direction == "left" ? "offsetLeft" : "offsetTop"];
        leftOrUp = leftOrUp - this.movepx >= 0 ? leftOrUp - this.movepx : 0;
        this.dom.style[direction == "left" ? "left" : "top"] = leftOrUp + "px";
        if (leftOrUp == 0) {
            this.stopMove();
        }
    };
    //右或下移动
    Flyer.prototype.moveRightDown = function (direction) {
        var leftOrUp = this.dom[direction == "right" ? "offsetLeft" : "offsetTop"];
        var maxDistance = direction == "right"
            ? this.gameWidth - this.dom.clientWidth
            : this.gameHeight - this.dom.clientHeight;
        leftOrUp =
            leftOrUp + this.movepx <= maxDistance
                ? leftOrUp + this.movepx
                : maxDistance;
        this.dom.style[direction == "right" ? "left" : "top"] = leftOrUp + "px";
        if (leftOrUp == maxDistance) {
            this.stopMove();
        }
    };
    //停止移动
    Flyer.prototype.stopMove = function () {
        this.isMove = false;
        clearInterval(this.moveId);
    };
    //发射子弹,enemyList为敌机列表
    Flyer.prototype.sendBullet = function (enemyList) {
        // console.log('flyer: send bullet')
        //判断发单数是否超出
        if (this.bulletLevel + this.nowBullet > this.maxBullet) {
            return;
        }
        var _this = this;
        //循环发弹，根据飞机子弹级别
        for (var i = 1, l = this.bulletLevel; i <= l; i++) {
            //新建一个子弹对象
            var bullet = new Bullet();
            //将子弹的dom添加到游戏背景中
            this.gamePanel.appendChild(bullet.dom);
            //设置子弹的初始位置
            bullet.setPosition({
                left: this.dom.offsetLeft,
                top: this.dom.offsetTop,
                width: this.dom.clientWidth,
                position: i,
                level: l
            });
            //重写子弹的检测是否打中敌机函数
            bullet.checkBeat = function () {
                //遍历敌机列表，判断是否打中敌机
                for (var i = 0, l = enemyList.length; i < l; i++) {
                    //敌机是死的，跳过
                    if (!enemyList[i].isLive)
                        continue;
                    //获取敌机的x,y坐标以及半径，还有子弹的x,y坐标以及半径
                    var e_left = enemyList[i].dom.offsetLeft, e_top = enemyList[i].dom.offsetTop, e_radius = enemyList[0].dom.clientWidth / 2, b_left = this.dom.offsetLeft, b_top = this.dom.offsetTop, b_radius = bullet.dom.clientWidth / 2;
                    //判断是否被击中
                    //原理，比较两个圆的圆心距与两个圆的半径之和
                    if (Math.sqrt(Math.pow(e_left - b_left, 2) + Math.pow(e_top - b_top, 2)) <=
                        e_radius + b_radius) {
                        //敌机死亡
                        enemyList[i].isLive = false;
                        //修改分数
                        _this.onChangeScore();
                        //返回true
                        return true;
                    }
                }
                return false;
            };
            //重写子弹的结束函数
            bullet.onend = function () {
                //从游戏背景移除子弹
                console.log("remove bullet.");
                _this.gamePanel.removeChild(this.dom);
                //已经发弹数减一
                _this.nowBullet--;
            };
            //发弹动画，就是移动
            bullet.animation();
            //已发弹数加一
            _this.nowBullet++;
        }
    };
    //飞机爆炸
    Flyer.prototype.burstFlyer = function () {
        this.dom.className = "bingo";
    };
    //发射子弹外部接口，主要任务为回调sendBullet函数，传入敌机列表参数
    Flyer.prototype.onSendBullet = function () { };
    //改分数外部接口
    Flyer.prototype.onChangeScore = function () { };
    return Flyer;
}(Movable));
//游戏控制类
var Game = /** @class */ (function () {
    function Game() {
        //敌机列表
        this.enemyList = [];
        //分数
        this.score = 0;
        //游戏是否结束
        this.isGameOver = false;
    }
    //初始化
    Game.prototype.init = function () {
        // console.log('game: init');
        var _this = this;
        //获取游戏背景
        this.gamePanel = document.getElementById("gamePanel");
        //游戏背景获得焦点
        this.gamePanel.focus();
        //启动飞机
        this.startFlyer();
        //启动 敌机
        this.startEnemy();
        //设置键盘按下与释放事件
        document.body.onkeydown = function (e) {
            _this.onkeydown(e);
        };
        document.body.onkeyup = function (e) {
            _this.onkeyup(e);
        };
    };
    //启动飞机
    Game.prototype.startFlyer = function () {
        // console.log('game: start Flyer');
        var _this = this;
        //新建飞机对象
        this.flyer = new Flyer();
        //设置位置
        this.flyer.setPosition(this.gamePanel, this.gamePanel.clientWidth, this.gamePanel.clientHeight);
        //重写发弹函数
        this.flyer.onSendBullet = function () {
            this.sendBullet(_this.enemyList);
        };
        //重写修改分数
        this.flyer.onChangeScore = function () {
            _this.changeScore();
        };
        this.flyer2 = new Flyer();
        //设置位置
        this.flyer2.setPosition(this.gamePanel, this.gamePanel.clientWidth, this.gamePanel.clientHeight);
        //重写发弹函数
        this.flyer2.onSendBullet = function () {
            this.sendBullet(_this.enemyList);
        };
        //重写修改分数
        this.flyer2.onChangeScore = function () {
            _this.changeScore();
        };
    };
    //启动敌机
    Game.prototype.startEnemy = function () {
        // console.log('game: start enemy');
        //游戏结束，退出
        if (this.isGameOver)
            return;
        var _this = this;
        //新建一个敌机对象
        var enemy = new Enemy();
        //将敌机添加进游戏背景
        this.gamePanel.appendChild(enemy.dom);
        //随机出敌机的x坐标位置
        var randomX = Math.random() * (this.gamePanel.clientWidth / enemy.dom.clientWidth);
        // var randomX = parseInt(Math.random()* (this.gamePanel.clientWidth / enemy.dom.clientWidth),10);
        //设置位置
        enemy.setPosition(randomX * enemy.dom.clientWidth, 0);
        //重写检测是否击中飞机玩家
        enemy.OnCheckCrash = function () {
            //游戏结束，退出
            if (_this.isGameOver)
                return;
            //判断是否击中
            if (Math.sqrt(Math.pow(_this.flyer.dom.offsetLeft - this.dom.offsetLeft, 2) +
                Math.pow(_this.flyer.dom.offsetTop - this.dom.offsetTop, 2)) <=
                _this.flyer.dom.clientWidth / 2 + this.dom.clientWidth / 2 ||
                Math.sqrt(Math.pow(_this.flyer2.dom.offsetLeft - this.dom.offsetLeft, 2) +
                    Math.pow(_this.flyer2.dom.offsetTop - this.dom.offsetTop, 2)) <=
                    _this.flyer2.dom.clientWidth / 2 + this.dom.clientWidth / 2) {
                //敌机死亡
                this.isLive = false;
                //飞机玩家爆炸
                _this.flyer.burstFlyer();
                return true;
            }
            return false;
        };
        //重写敌机结束事件
        enemy.onend = function () {
            _this.gamePanel.removeChild(this.dom);
            _this.remove(_this.enemyList, this);
            // _this.enemyList.remove(this);
        };
        //游戏结束函数
        enemy.gameover = function () {
            _this.gameover();
        };
        //敌机移动
        enemy.animation(this.gamePanel.clientWidth, this.gamePanel.clientHeight);
        //将敌机添加到列表中
        this.enemyList.push(enemy);
        //启动
        setTimeout(function () {
            _this.startEnemy();
        }, 500);
    };
    //键盘按下事件
    Game.prototype.onkeydown = function (e) {
        e = e || window.event;
        var keyCode = e.keyCode;
        // console.log('key down: ', e.keyCode);
        //阻止浏览器默认事件
        if (keyCode == 32 ||
            keyCode == 76 ||
            this.flyer.keyCodeAndDirection[keyCode]) {
            if (e.preventDefault) {
                // console.log('e.preventDefault');
                e.preventDefault();
            }
            else
                e.returnValue = false;
        }
        else
            return;
        //回调飞机键盘按下事件
        // 37 : "left",
        // 38 : "up",
        // 39 : "right",
        // 40 : "down",
        // 32 : space
        // 65 : "left",
        // 87 : "up",
        // 68 : "right",
        // 83 : "down"
        // 76 : L
        switch (keyCode) {
            case 32:
            case 37:
            case 38:
            case 39:
            case 40:
                this.flyer.keydown(e);
                break;
            case 65:
            case 87:
            case 68:
            case 83:
            case 76:
                this.flyer2.keydown(e);
                break;
        }
    };
    //键盘释放事件
    Game.prototype.onkeyup = function (e) {
        e = e || window.event;
        //回调飞机键盘释放事件
        // console.log('keyup: ', e.keyCode)
        switch (e.keyCode) {
            case 32:
            case 37:
            case 38:
            case 39:
            case 40:
                this.flyer.keyup(e);
                break;
            case 65:
            case 87:
            case 68:
            case 83:
            case 76:
                this.flyer2.keyup(e);
                break;
        }
    };
    //修改分数
    Game.prototype.changeScore = function () {
        this.score += 100;
        document.getElementById("score").innerHTML = this.score.toString();
        //分数级别
        var scoreLevel = this.score / 5000 + 1;
        //判断是否升级飞机子弹级别
        if (scoreLevel > 1) {
            this.flyer.bulletLevel = scoreLevel > 4 ? 4 : scoreLevel;
            this.flyer2.bulletLevel = scoreLevel > 4 ? 4 : scoreLevel;
            //修改敌机移动速度
            // Enemy.movesp = Enemy.movespMap[this.flyer.bulletLevel];
        }
    };
    Game.prototype.remove = function (array, obj) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] == obj) {
                array.splice(i, 1);
                return this;
            }
        }
        throw "The Array has no this Obj";
    };
    //游戏结束
    Game.prototype.gameover = function () {
        this.isGameOver = true;
        document.getElementById("score").innerHTML =
            "The Game is Over...You Score:" + this.score;
        for (var i = 0, l = this.enemyList.length; i < l; i++) {
            this.gamePanel.removeChild(this.enemyList[0].dom);
            this.remove(this.enemyList, this.enemyList[0]);
            // this.enemyList.remove(this.enemyList[0]);
        }
        this.gamePanel.removeChild(this.flyer.dom);
        this.gamePanel.removeChild(this.flyer2.dom);
        this.flyer = null;
        this.flyer2 = null;
        this.score = 0;
        this.gamePanel = null;
        document.body.onkeydown = null;
        document.body.onkeyup = null;
        document.getElementById("startBtn").style.display = "block";
    };
    return Game;
}());
//游戏开始入口
function Start() {
    var game = new Game();
    game.isGameOver = false;
    game.init();
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("score").innerHTML = "0";
}
