require = function a(o, r, c) {
function u(i, t) {
if (!r[i]) {
if (!o[i]) {
var e = "function" == typeof require && require;
if (!t && e) return e(i, !0);
if (d) return d(i, !0);
var n = new Error("Cannot find module '" + i + "'");
throw n.code = "MODULE_NOT_FOUND", n;
}
var s = r[i] = {
exports: {}
};
o[i][0].call(s.exports, function(t) {
var e = o[i][1][t];
return u(e || t);
}, s, s.exports, a, o, r, c);
}
return r[i].exports;
}
for (var d = "function" == typeof require && require, t = 0; t < c.length; t++) u(c[t]);
return u;
}({
ActorRenderer: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "1a792KO87NBg7vCCIp1jq+j", "ActorRenderer");
var o = t("Game"), n = t("Types"), s = t("Utils"), a = n.ActorPlayingState;
cc.Class({
extends: cc.Component,
properties: {
playerInfo: {
default: null,
type: cc.Node
},
stakeOnTable: {
default: null,
type: cc.Node
},
cardInfo: {
default: null,
type: cc.Node
},
cardPrefab: {
default: null,
type: cc.Prefab
},
anchorCards: {
default: null,
type: cc.Node
},
spPlayerName: {
default: null,
type: cc.Sprite
},
labelPlayerName: {
default: null,
type: cc.Label
},
labelTotalStake: {
default: null,
type: cc.Label
},
spPlayerPhoto: {
default: null,
type: cc.Sprite
},
spCountdown: {
default: null,
type: cc.Sprite
},
labelStakeOnTable: {
default: null,
type: cc.Label
},
spChips: {
default: [],
type: cc.Sprite
},
labelCardInfo: {
default: null,
type: cc.Label
},
spCardInfo: {
default: null,
type: cc.Sprite
},
animFX: {
default: null,
type: cc.Node
},
cardSpace: 0
},
onLoad: function() {},
init: function(t, e, i, n, s) {
this.actor = this.getComponent("Actor");
this.sgCountdown = null;
this.turnDuration = n;
this.playerInfo.position = e;
this.stakeOnTable.position = i;
this.labelPlayerName.string = t.name;
this.updateTotalStake(t.gold);
var a = t.photoIdx % 5;
this.spPlayerPhoto.spriteFrame = o.instance.assetMng.playerPhotos[a];
this.animFX = this.animFX.getComponent("FXPlayer");
this.animFX.init();
this.animFX.show(!1);
this.cardInfo.active = !1;
this.progressTimer = this.initCountdown();
if (s) {
this.spCardInfo.getComponent("SideSwitcher").switchSide();
this.spPlayerName.getComponent("SideSwitcher").switchSide();
}
},
initDealer: function() {
this.actor = this.getComponent("Actor");
this.animFX = this.animFX.getComponent("FXPlayer");
this.animFX.init();
this.animFX.show(!1);
},
updateTotalStake: function(t) {
this.labelTotalStake.string = "$" + t;
},
initCountdown: function() {
var t = o.instance.assetMng.texCountdown.getTexture();
this.sgCountdown = new _ccsg.Sprite(t);
var e = new cc.ProgressTimer(this.sgCountdown);
e.setName("progressTimer");
e.setMidpoint(cc.p(.5, .5));
e.setType(cc.ProgressTimer.Type.RADIAL);
this.playerInfo._sgNode.addChild(e);
e.setPosition(cc.p(0, 0));
e.setPercentage(0);
return e;
},
startCountdown: function() {
if (this.progressTimer) {
var t = cc.progressFromTo(this.turnDuration, 0, 100);
this.progressTimer.runAction(t);
}
},
resetCountdown: function() {
if (this.progressTimer) {
this.progressTimer.stopAllActions();
this.progressTimer.setPercentage(0);
}
},
playBlackJackFX: function() {
this.animFX.playFX("blackjack");
},
playBustFX: function() {
this.animFX.playFX("bust");
},
onDeal: function(t, e) {
var i = cc.instantiate(this.cardPrefab).getComponent("Card");
this.anchorCards.addChild(i.node);
i.init(t);
i.reveal(e);
var n = cc.p(0, 0), s = this.actor.cards.length - 1, a = cc.p(this.cardSpace * s, 0);
i.node.setPosition(n);
var o = cc.moveTo(.5, a), r = cc.callFunc(this._onDealEnd, this, this.cardSpace * s);
i.node.runAction(cc.sequence(o, r));
},
_onDealEnd: function(t, e) {
this.resetCountdown();
this.actor.state === a.Normal && this.startCountdown();
this.updatePoint();
this._updatePointPos(e);
},
onReset: function() {
this.cardInfo.active = !1;
this.anchorCards.removeAllChildren();
this._resetChips();
},
onRevealHoldCard: function() {
cc.find("cardPrefab", this.anchorCards).getComponent("Card").reveal(!0);
this.updateState();
},
updatePoint: function() {
this.cardInfo.active = !0;
this.labelCardInfo.string = this.actor.bestPoint;
switch (this.actor.hand) {
case n.Hand.BlackJack:
this.animFX.show(!0);
this.animFX.playFX("blackjack");
break;

case n.Hand.FiveCard:
}
},
_updatePointPos: function(t) {
this.cardInfo.setPositionX(t + 50);
},
showStakeChips: function(t) {
var e = this.spChips, i = 0;
5e4 < t ? i = 5 : 25e3 < t ? i = 4 : 1e4 < t ? i = 3 : 5e3 < t ? i = 2 : 0 < t && (i = 1);
for (var n = 0; n < i; ++n) e[n].enabled = !0;
},
_resetChips: function() {
for (var t = 0; t < this.spChips.length; ++t) this.spChips.enabled = !1;
},
updateState: function() {
switch (this.actor.state) {
case a.Normal:
this.cardInfo.active = !0;
this.spCardInfo.spriteFrame = o.instance.assetMng.texCardInfo;
this.updatePoint();
break;

case a.Bust:
var t = s.getMinMaxPoint(this.actor.cards).min;
this.labelCardInfo.string = "爆牌(" + t + ")";
this.spCardInfo.spriteFrame = o.instance.assetMng.texBust;
this.cardInfo.active = !0;
this.animFX.show(!0);
this.animFX.playFX("bust");
this.resetCountdown();
break;

case a.Stand:
var e = s.getMinMaxPoint(this.actor.cards).max;
this.labelCardInfo.string = "停牌(" + e + ")";
this.spCardInfo.spriteFrame = o.instance.assetMng.texCardInfo;
this.resetCountdown();
}
}
});
cc._RF.pop();
}, {
Game: "Game",
Types: "Types",
Utils: "Utils"
} ],
Actor: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "7d008dTf6xB2Z0wCAdzh1Rx", "Actor");
var n = t("Types"), s = t("Utils"), a = n.ActorPlayingState;
cc.Class({
extends: cc.Component,
properties: {
cards: {
default: [],
serializable: !1,
visible: !1
},
holeCard: {
default: null,
serializable: !1,
visible: !1
},
bestPoint: {
get: function() {
return s.getMinMaxPoint(this.cards).max;
}
},
hand: {
get: function() {
var t = this.cards.length;
this.holeCard && ++t;
return 5 <= t ? n.Hand.FiveCard : 2 === t && 21 === this.bestPoint ? n.Hand.BlackJack : n.Hand.Normal;
}
},
canReport: {
get: function() {
return this.hand !== n.Hand.Normal;
},
visible: !1
},
renderer: {
default: null,
type: cc.Node
},
state: {
default: a.Normal,
notify: function(t) {
this.state !== t && this.renderer.updateState();
},
type: a,
serializable: !1
}
},
init: function() {
this.ready = !0;
this.renderer = this.getComponent("ActorRenderer");
},
addCard: function(t) {
this.cards.push(t);
this.renderer.onDeal(t, !0);
var e = this.holeCard ? [ this.holeCard ].concat(this.cards) : this.cards;
s.isBust(e) && (this.state = a.Bust);
},
addHoleCard: function(t) {
this.holeCard = t;
this.renderer.onDeal(t, !1);
},
stand: function() {
this.state = a.Stand;
},
revealHoldCard: function() {
if (this.holeCard) {
this.cards.unshift(this.holeCard);
this.holeCard = null;
this.renderer.onRevealHoldCard();
}
},
report: function() {
this.state = a.Report;
},
reset: function() {
this.cards = [];
this.holeCard = null;
this.reported = !1;
this.state = a.Normal;
this.renderer.onReset();
}
});
cc._RF.pop();
}, {
Types: "Types",
Utils: "Utils"
} ],
AssetMng: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "54522LcoVpPHbrqYgwp/1Qm", "AssetMng");
cc.Class({
extends: cc.Component,
properties: {
texBust: {
default: null,
type: cc.SpriteFrame
},
texCardInfo: {
default: null,
type: cc.SpriteFrame
},
texCountdown: {
default: null,
type: cc.SpriteFrame
},
texBetCountdown: {
default: null,
type: cc.SpriteFrame
},
playerPhotos: {
default: [],
type: cc.SpriteFrame
}
}
});
cc._RF.pop();
}, {} ],
AudioMng: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "01ca4tStvVH+JmZ5TNcmuAu", "AudioMng");
cc.Class({
extends: cc.Component,
properties: {
winAudio: {
default: null,
url: cc.AudioClip
},
loseAudio: {
default: null,
url: cc.AudioClip
},
cardAudio: {
default: null,
url: cc.AudioClip
},
buttonAudio: {
default: null,
url: cc.AudioClip
},
chipsAudio: {
default: null,
url: cc.AudioClip
},
bgm: {
default: null,
url: cc.AudioClip
}
},
playMusic: function() {
cc.audioEngine.playMusic(this.bgm, !0);
},
pauseMusic: function() {
cc.audioEngine.pauseMusic();
},
resumeMusic: function() {
cc.audioEngine.resumeMusic();
},
_playSFX: function(t) {
cc.audioEngine.playEffect(t, !1);
},
playWin: function() {
this._playSFX(this.winAudio);
},
playLose: function() {
this._playSFX(this.loseAudio);
},
playCard: function() {
this._playSFX(this.cardAudio);
},
playChips: function() {
this._playSFX(this.chipsAudio);
},
playButton: function() {
this._playSFX(this.buttonAudio);
}
});
cc._RF.pop();
}, {} ],
Bet: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "28f38yToT1Pw7NgyeCvRxDC", "Bet");
var s = t("Game");
cc.Class({
extends: cc.Component,
properties: {
chipPrefab: {
default: null,
type: cc.Prefab
},
btnChips: {
default: [],
type: cc.Node
},
chipValues: {
default: [],
type: "Integer"
},
anchorChipToss: {
default: null,
type: cc.Node
}
},
init: function() {
this._registerBtns();
},
_registerBtns: function() {
for (var i = this, t = function(e) {
i.btnChips[n].on("touchstart", function(t) {
s.instance.addStake(i.chipValues[e]) && i.playAddChip();
}, this);
}, n = 0; n < i.btnChips.length; ++n) t(n);
},
playAddChip: function() {
var t = cc.p(50 * cc.randomMinus1To1(), 50 * cc.randomMinus1To1()), e = cc.instantiate(this.chipPrefab);
this.anchorChipToss.addChild(e);
e.setPosition(t);
e.getComponent("TossChip").play();
},
resetChips: function() {
s.instance.resetStake();
s.instance.info.enabled = !1;
this.resetTossedChips();
},
resetTossedChips: function() {
this.anchorChipToss.removeAllChildren();
}
});
cc._RF.pop();
}, {
Game: "Game"
} ],
ButtonScaler: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "a171dSnCXFMRIqs1IWdvgWM", "ButtonScaler");
cc.Class({
extends: cc.Component,
properties: {
pressedScale: 1,
transDuration: 0
},
onLoad: function() {
var e = this, i = cc.find("Menu/AudioMng") || cc.find("Game/AudioMng");
i && (i = i.getComponent("AudioMng"));
e.initScale = this.node.scale;
e.button = e.getComponent(cc.Button);
e.scaleDownAction = cc.scaleTo(e.transDuration, e.pressedScale);
e.scaleUpAction = cc.scaleTo(e.transDuration, e.initScale);
function t(t) {
this.stopAllActions();
this.runAction(e.scaleUpAction);
}
this.node.on("touchstart", function(t) {
this.stopAllActions();
i && i.playButton();
this.runAction(e.scaleDownAction);
}, this.node);
this.node.on("touchend", t, this.node);
this.node.on("touchcancel", t, this.node);
}
});
cc._RF.pop();
}, {} ],
Card: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "ab67e5QkiVCBZ3DIMlWhiAt", "Card");
cc.Class({
extends: cc.Component,
properties: {
point: {
default: null,
type: cc.Label
},
suit: {
default: null,
type: cc.Sprite
},
mainPic: {
default: null,
type: cc.Sprite
},
cardBG: {
default: null,
type: cc.Sprite
},
redTextColor: cc.Color.WHITE,
blackTextColor: cc.Color.WHITE,
texFrontBG: {
default: null,
type: cc.SpriteFrame
},
texBackBG: {
default: null,
type: cc.SpriteFrame
},
texFaces: {
default: [],
type: cc.SpriteFrame
},
texSuitBig: {
default: [],
type: cc.SpriteFrame
},
texSuitSmall: {
default: [],
type: cc.SpriteFrame
}
},
init: function(t) {
var e = 10 < t.point;
this.mainPic.spriteFrame = e ? this.texFaces[t.point - 10 - 1] : this.texSuitBig[t.suit - 1];
this.point.string = t.pointName;
t.isRedSuit ? this.point.node.color = this.redTextColor : this.point.node.color = this.blackTextColor;
this.suit.spriteFrame = this.texSuitSmall[t.suit - 1];
},
reveal: function(t) {
this.point.node.active = t;
this.suit.node.active = t;
this.mainPic.node.active = t;
this.cardBG.spriteFrame = t ? this.texFrontBG : this.texBackBG;
}
});
cc._RF.pop();
}, {} ],
CounterTest: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "b0926/aIatATYgTuL0RyW/q", "CounterTest");
cc.Class({
extends: cc.Component,
properties: {
target: {
default: null,
type: cc.Label
}
},
onLoad: function() {
this.target.node.color = cc.Color.GREEN;
},
update: function(t) {}
});
cc._RF.pop();
}, {} ],
Dealer: [ function(s, t, e) {
"use strict";
cc._RF.push(t, "ce2dfoqEulHCLjS1Z9xPN7t", "Dealer");
var i = s("Actor"), n = s("Utils");
cc.Class({
extends: i,
properties: {
bestPoint: {
get: function() {
var t = this.holeCard ? [ this.holeCard ].concat(this.cards) : this.cards;
return n.getMinMaxPoint(t).max;
},
override: !0
}
},
init: function() {
this._super();
this.renderer.initDealer();
},
wantHit: function() {
var t = s("Game"), e = s("Types"), i = this.bestPoint;
if (21 === i) return !1;
if (i <= 11) return !0;
var n = t.instance.player;
switch (t.instance._getPlayerResult(n, this)) {
case e.Outcome.Win:
return !0;

case e.Outcome.Lose:
return !1;
}
return this.bestPoint < 17;
}
});
cc._RF.pop();
}, {
Actor: "Actor",
Game: "Game",
Types: "Types",
Utils: "Utils"
} ],
Decks: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "17024G0JFpHcLI5GREbF8VN", "Decks");
var s = t("Types");
function n(t) {
this._numberOfDecks = t;
this._cardIds = new Array(52 * t);
this.reset();
}
n.prototype.reset = function() {
this._cardIds.length = 52 * this._numberOfDecks;
for (var t = 0, e = s.Card.fromId, i = 0; i < this._numberOfDecks; ++i) for (var n = 0; n < 52; ++n) {
this._cardIds[t] = e(n);
++t;
}
};
n.prototype.draw = function() {
var t = this._cardIds, e = t.length;
if (0 === e) return null;
var i = Math.random() * e | 0, n = t[i], s = t[e - 1];
t[i] = s;
t.length = e - 1;
return n;
};
e.exports = n;
cc._RF.pop();
}, {
Types: "Types"
} ],
FXPlayer: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "68da2yjdGVMSYhXLN9DukIB", "FXPlayer");
cc.Class({
extends: cc.Component,
init: function() {
this.anim = this.getComponent(cc.Animation);
this.sprite = this.getComponent(cc.Sprite);
},
show: function(t) {
this.sprite.enabled = t;
},
playFX: function(t) {
this.anim.play(t);
},
hideFX: function() {
this.sprite.enabled = !1;
}
});
cc._RF.pop();
}, {} ],
Game: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "63738OONCFKHqsf4QSeJSun", "Game");
var o = t("PlayerData").players, n = t("Decks"), s = t("Types"), a = s.ActorPlayingState, r = t("game-fsm"), c = cc.Class({
extends: cc.Component,
properties: {
playerAnchors: {
default: [],
type: cc.Node
},
playerPrefab: {
default: null,
type: cc.Prefab
},
dealer: {
default: null,
type: cc.Node
},
inGameUI: {
default: null,
type: cc.Node
},
betUI: {
default: null,
type: cc.Node
},
assetMng: {
default: null,
type: cc.Node
},
audioMng: {
default: null,
type: cc.Node
},
turnDuration: 0,
betDuration: 0,
totalChipsNum: 0,
totalDiamondNum: 0,
numberOfDecks: {
default: 1,
type: "Integer"
}
},
statics: {
instance: null
},
onLoad: function() {
(c.instance = this).inGameUI = this.inGameUI.getComponent("InGameUI");
this.assetMng = this.assetMng.getComponent("AssetMng");
this.audioMng = this.audioMng.getComponent("AudioMng");
this.betUI = this.betUI.getComponent("Bet");
this.inGameUI.init(this.betDuration);
this.betUI.init();
this.dealer = this.dealer.getComponent("Dealer");
this.dealer.init();
this.player = null;
this.createPlayers();
this.info = this.inGameUI.resultTxt;
this.totalChips = this.inGameUI.labelTotalChips;
this.decks = new n(this.numberOfDecks);
this.fsm = r;
this.fsm.init(this);
this.updateTotalChips();
this.audioMng.playMusic();
},
addStake: function(t) {
if (this.totalChipsNum < t) {
console.log("not enough chips!");
this.info.enabled = !0;
this.info.string = "金币不足!";
return !1;
}
this.totalChipsNum -= t;
this.updateTotalChips();
this.player.addStake(t);
this.audioMng.playChips();
this.info.enabled = !1;
this.info.string = "请下注";
return !0;
},
resetStake: function() {
this.totalChipsNum += this.player.stakeNum;
this.player.resetStake();
this.updateTotalChips();
},
updateTotalChips: function() {
this.totalChips.string = this.totalChipsNum;
this.player.renderer.updateTotalStake(this.totalChipsNum);
},
createPlayers: function() {
for (var t = 0; t < 5; ++t) {
var e = cc.instantiate(this.playerPrefab), i = this.playerAnchors[t], n = 2 < t;
i.addChild(e);
e.position = cc.p(0, 0);
var s = cc.find("anchorPlayerInfo", i).getPosition(), a = cc.find("anchorStake", i).getPosition();
e.getComponent("ActorRenderer").init(o[t], s, a, this.turnDuration, n);
if (2 === t) {
this.player = e.getComponent("Player");
this.player.init();
}
}
},
hit: function() {
this.player.addCard(this.decks.draw());
this.player.state === a.Bust && this.fsm.onPlayerActed();
this.audioMng.playCard();
this.audioMng.playButton();
},
stand: function() {
this.player.stand();
this.audioMng.playButton();
this.fsm.onPlayerActed();
},
deal: function() {
this.fsm.toDeal();
this.audioMng.playButton();
},
start: function() {
this.fsm.toBet();
this.audioMng.playButton();
},
report: function() {
this.player.report();
this.fsm.onPlayerActed();
},
quitToMenu: function() {
cc.director.loadScene("menu");
},
onEnterDealState: function() {
this.betUI.resetTossedChips();
this.inGameUI.resetCountdown();
this.player.renderer.showStakeChips(this.player.stakeNum);
this.player.addCard(this.decks.draw());
var t = this.decks.draw();
this.dealer.addHoleCard(t);
this.player.addCard(this.decks.draw());
this.dealer.addCard(this.decks.draw());
this.audioMng.playCard();
this.fsm.onDealed();
},
onPlayersTurnState: function(t) {
t && this.inGameUI.showGameState();
},
onEnterDealersTurnState: function() {
for (;this.dealer.state === a.Normal; ) this.dealer.wantHit() ? this.dealer.addCard(this.decks.draw()) : this.dealer.stand();
this.fsm.onDealerActed();
},
onEndState: function(t) {
if (t) {
this.dealer.revealHoldCard();
this.inGameUI.showResultState();
switch (this._getPlayerResult(this.player, this.dealer)) {
case s.Outcome.Win:
this.info.string = "You Win";
this.audioMng.pauseMusic();
this.audioMng.playWin();
this.totalChipsNum += this.player.stakeNum;
var e = this.player.stakeNum;
!this.player.state === s.ActorPlayingState.Report && (this.player.hand === s.Hand.BlackJack ? e *= 1.5 : e *= 2);
this.totalChipsNum += e;
this.updateTotalChips();
break;

case s.Outcome.Lose:
this.info.string = "You Lose";
this.audioMng.pauseMusic();
this.audioMng.playLose();
break;

case s.Outcome.Tie:
this.info.string = "Draw";
this.totalChipsNum += this.player.stakeNum;
this.updateTotalChips();
}
}
this.info.enabled = t;
},
onBetState: function(t) {
if (t) {
this.decks.reset();
this.player.reset();
this.dealer.reset();
this.info.string = "请下注";
this.inGameUI.showBetState();
this.inGameUI.startCountdown();
this.audioMng.resumeMusic();
}
this.info.enabled = t;
},
_getPlayerResult: function(t, e) {
var i = s.Outcome;
return t.state === a.Bust ? i.Lose : e.state === a.Bust ? i.Win : t.state === a.Report ? i.Win : t.hand > e.hand ? i.Win : t.hand < e.hand ? i.Lose : t.bestPoint === e.bestPoint ? i.Tie : t.bestPoint < e.bestPoint ? i.Lose : i.Win;
}
});
cc._RF.pop();
}, {
Decks: "Decks",
PlayerData: "PlayerData",
Types: "Types",
"game-fsm": "game-fsm"
} ],
HotUpdate: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "e390cpl5vpL54CRkH0xI8Ul", "HotUpdate");
var n = t("../UI/UpdatePanel"), s = JSON.stringify({
packageUrl: "http://192.168.54.39:5555/tutorial-hot-update/remote-assets/",
remoteManifestUrl: "http://192.168.54.39:5555/tutorial-hot-update/remote-assets/project.manifest",
remoteVersionUrl: "http://192.168.54.39:5555/tutorial-hot-update/remote-assets/version.manifest",
version: "0.9.0",
assets: {
"src/jsb_anysdk.js": {
size: 7418,
md5: "7551284fcba1c5543c0454526bb8991a"
},
"src/jsb_anysdk_constants.js": {
size: 21991,
md5: "03a1f55f34f9615052326cb5bfb81bda"
},
"src/jsb_polyfill.js": {
size: 1299956,
md5: "92ea2c1c290f0917e9bb6ccf3e267de7"
},
"src/project.dev.js": {
size: 127995,
md5: "ba2914be0bbc107bb3676ca270ebc9f6"
},
"src/settings.js": {
size: 7101,
md5: "4eb850f4da8a26e02c9fe249cd26536a"
},
"res/import/02/022a80ab-4cde-42ca-9e04-8a23745cf138.json": {
size: 344,
md5: "4d23513ea2ea9379adf3c05191f835a5"
},
"res/import/11/11c8b27e-29a0-4c2f-ac31-03a2e5793b7c.json": {
size: 285,
md5: "78c74eb2be3a20b7b67b1db189c7c8d5"
},
"res/import/25/25b2a633-f269-42d2-80f8-110e834238eb.json": {
size: 281,
md5: "5ec2ba2e98247b9c575dafeefce76868"
},
"res/import/26/26f1e1b9-a0c6-41a6-a8ff-3102f3cbc784.json": {
size: 281,
md5: "92249a05b7d0aadadf22fd65afcacc67"
},
"res/import/29/29158224-f8dd-4661-a796-1ffab537140e.json": {
size: 351,
md5: "321e6f519c8e6371949380648b18d5f0"
},
"res/import/2e/2e9b2dc0-65b4-44e5-b624-d61da9ee1095.json": {
size: 294,
md5: "816d6c419f7d68d060ca817207afcde9"
},
"res/import/31/31d39d6b-7784-426a-b1bb-370492f0d5f6.json": {
size: 278,
md5: "58fd44e490fa7467e061ea48a5a5ae1a"
},
"res/import/3f/3f7d6f14-8e3f-432c-a537-09c8c7e03b76.json": {
size: 8428,
md5: "b805b2a3c837d718fde8a2c938a75ecf"
},
"res/import/41/41dc20a6-d60a-4f55-854e-860d2ad6348b.json": {
size: 279,
md5: "143a327b17d121e3aa5713ef2fc2ff8f"
},
"res/import/42/42b84506-55b4-4b98-8d2e-b3f8cfe7fbf8.json": {
size: 284,
md5: "f819ec05d786092e4ec37a1e685b7ea7"
},
"res/import/45/45d0f893-f7b7-4c84-8bd9-dd6409ec6de9.json": {
size: 283,
md5: "f9fdfe798671b31f8b92352aaeb90484"
},
"res/import/55/55e0a94a-b236-4c6b-8e0d-322e198e24a3.json": {
size: 281,
md5: "7744303e8c89fe31c6c40cc59e0d5aa1"
},
"res/import/57/5717c77c-65de-4232-9714-b0c663df738d.json": {
size: 279,
md5: "3b4fe8448300b3db8204c16cb3ad2208"
},
"res/import/5a/5a7ed901-bdc1-4823-8b0d-d2db8d4506ea.json": {
size: 282,
md5: "436998ef69da439176ef33f4aa88278a"
},
"res/import/5b/5bfc8b76-5eb6-4cf9-a83a-24a508103512.json": {
size: 280,
md5: "8c5055627a2364e1e7fbc4384f44c798"
},
"res/import/60/6035fac6-5208-4e0b-bea7-62ff9fb1338b.json": {
size: 279,
md5: "9ba69e76df5bcceb2530c14c2bcfad71"
},
"res/import/65/65f8dd44-9c0c-481b-9b78-c219307a0525.json": {
size: 277,
md5: "a11bd42fb5de91b77e5cbcbefe7566f1"
},
"res/import/67/679e44ab-196f-4a53-9cfa-ca9ba7c8ba43.json": {
size: 278,
md5: "375f6a8d3ad4c7c17dfd7237f2828cbd"
},
"res/import/67/67e68bc9-dad5-4ad9-a2d8-7e03d458e32f.json": {
size: 350,
md5: "536b330599d9053d608a3eaec97531b7"
},
"res/import/6b/6b10b986-3d86-4b46-bae1-fad18ce50e5b.json": {
size: 5773,
md5: "152a2ba56c8d70080bd12fd7e241ab8b"
},
"res/import/74/7459fc8e-3723-4d95-8594-ac8eea99f27e.json": {
size: 285,
md5: "4698aa20689f02f63ceea0ba6ea34623"
},
"res/import/7a/7aee1866-01db-41aa-afe9-e4a791def6aa.json": {
size: 284,
md5: "3f9f4095e7cae5dc91e874300d0a3922"
},
"res/import/7d/7d1d4e60-aba2-48e8-85f8-8e328f34e7cc.json": {
size: 346,
md5: "6860d6b6442599be495011ee1d3e1304"
},
"res/import/7d/7de24e84-21bd-434b-8ca2-b031dcbb438e.json": {
size: 284,
md5: "be94548155488f9a40ca837aa6faa0d1"
},
"res/import/88/88e79fd5-96b4-4a77-a1f4-312467171014.json": {
size: 353,
md5: "d6b30af49554a4ef4442ec6ce744527f"
},
"res/import/8a/8a546935-70d4-42d2-a051-8d0e76f28008.json": {
size: 51536,
md5: "92c08f8766d2210763f205056cbde200"
},
"res/import/8a/8af78d65-4b41-4d59-a683-2659ab6904cb.json": {
size: 278,
md5: "d0df7e4fb5fbad7a2d7b17d64d40229e"
},
"res/import/91/913e121b-7770-4593-9a34-f8ca1b3e3b2f.json": {
size: 278,
md5: "22187ca903a109d1c6adeb02f6035972"
},
"res/import/93/935750ee-2a25-4d60-a10f-06b3000e28ab.json": {
size: 284,
md5: "d58a8b303270f3203bb62fa14d470623"
},
"res/import/94/944b1726-c679-48c6-987c-2abb49f9a11e.json": {
size: 282,
md5: "183dbd381da3382a1ac2f3adbb5aba2c"
},
"res/import/a2/a2da79be-fe22-420a-83b5-e37878367b06.json": {
size: 288,
md5: "68d9cb158a55b174b3c3cb49fe1fba82"
},
"res/import/a5/a5856afd-30ff-43e5-93f6-41e8be2d09d1.json": {
size: 281,
md5: "4c785aa9dd5bbe96560f060a71156f97"
},
"res/import/a8/a8b07ccf-1327-4931-b21a-d327cd0e2cdc.json": {
size: 289,
md5: "75f5f8811d03070d81dff9bd139a78b5"
},
"res/import/ac/ac0ee6f1-b6c2-4288-a1a3-78874f5bd5cb.json": {
size: 288,
md5: "166cb763f85eb5b9e1735fd350b0bf75"
},
"res/import/c0/c01466ea-7283-4fce-b615-4ee78c774af0.json": {
size: 285,
md5: "104b6bb55f5da857fbb8ed70a44b7d9f"
},
"res/import/c2/c2d0f392-28fb-47a7-aaf9-af40e75f40d3.json": {
size: 279,
md5: "b50b5d97b6927c26cdf8ca31c4beb8a9"
},
"res/import/ca/ca7dd73d-526a-4c85-9702-eb51e93b9d99.json": {
size: 353,
md5: "a78b0628aad6d9ab6792d6ee8322055f"
},
"res/import/d1/d1933017-c845-492d-aa72-bf71d7b48726.json": {
size: 340,
md5: "ff385bc93a011f217b4c6e0377a2f9bf"
},
"res/import/d5/d58859db-6a64-489b-aa1c-683e5f9a646b.json": {
size: 285,
md5: "3dcecab01d68022caad82558e5f0b94d"
},
"res/import/e4/e4f21e55-ed4f-46f8-b9a1-7ee9775d710c.json": {
size: 281,
md5: "72f940eabf7a9cc957e7e0ab0a205aad"
},
"res/import/e9/e9ec654c-97a2-4787-9325-e6a10375219a.json": {
size: 350,
md5: "140f529b491009e9d0b4e9e5b64ad3a3"
},
"res/import/ef/ef0e92d8-6db3-4e01-a1f0-5988bf72b4ec.json": {
size: 277,
md5: "317b0c75aa059d3a5f382c190d1ffdb0"
},
"res/import/ef/ef287833-459f-4ff4-a43a-7a6ddc8c95a9.json": {
size: 278,
md5: "c8560de161cca9b30912ce458d3a12a2"
},
"res/import/f0/f0048c10-f03e-4c97-b9d3-3506e1d58952.json": {
size: 349,
md5: "9cce7d772ea5910b267faad5656597cd"
},
"res/raw-assets/font/poker_number.png": {
size: 24298,
md5: "5dc839e4febcbe674ef00459c057a31e"
},
"res/raw-assets/project.manifest": {
size: 8738,
md5: "503559d7da0ebce8d9d3fc7ae24aaf3c"
},
"res/raw-assets/sfx/bgm2.mp3": {
size: 971644,
md5: "b291235f22a5c3e66430a5c4c25c84df"
},
"res/raw-assets/sfx/button.mp3": {
size: 3179,
md5: "91e69bb24ff6173032d04e232c275ad7"
},
"res/raw-assets/textures/UI/lobby/bg_changjing.png": {
size: 634171,
md5: "583bb4dbd4a4078aa306c4fcfb511f31"
},
"res/raw-assets/textures/UI/lobby/bg_gold.png": {
size: 2406,
md5: "2aa8e02bad500178f40f5af802bcf9a1"
},
"res/raw-assets/textures/UI/lobby/button_jjc.png": {
size: 94313,
md5: "17fb5c02c7470d95e84a97b264a54140"
},
"res/raw-assets/textures/UI/lobby/button_ksks.png": {
size: 82257,
md5: "2bb161d732a84fee4af197c89883a94f"
},
"res/raw-assets/textures/UI/lobby/button_zbc.png": {
size: 91423,
md5: "457f3d1bb5c1639a3f24be98e6420c1f"
},
"res/raw-assets/textures/UI/lobby/icon_back.png": {
size: 2209,
md5: "dd6ef4efc8f05eb77a7cbd50b7f0e6c2"
},
"res/raw-assets/textures/UI/lobby/icon_diamond.png": {
size: 6911,
md5: "7123a767755b66ffb65ca37818e35b99"
},
"res/raw-assets/textures/UI/lobby/icon_gold_big.png": {
size: 6417,
md5: "931cda98808c79f0a744da6be0764460"
},
"res/raw-assets/textures/UI/lobby/icon_gold_small.png": {
size: 3963,
md5: "d607637391fe90bd89057cf8b2d9f44f"
},
"res/raw-assets/textures/UI/lobby/icon_plus.png": {
size: 1530,
md5: "99194ee176ac173f78a2a5e1a03dea3a"
},
"res/raw-assets/textures/UI/lobby/icon_rule.png": {
size: 3840,
md5: "22ac7030c2348d7c08a444dddb7498ca"
},
"res/raw-assets/textures/UI/lobby/icon_set.png": {
size: 4665,
md5: "671960aa83d654972f3c42daf1b9e429"
},
"res/raw-assets/textures/UI/lobby/trophy_1.png": {
size: 11935,
md5: "9721c1c30e77661dd0e82888f8009fd5"
},
"res/raw-assets/textures/UI/lobby/trophy_2.png": {
size: 10982,
md5: "fa59b66c80741d535aabc8ad51363cb3"
},
"res/raw-assets/textures/UI/lobby/trophy_3.png": {
size: 11636,
md5: "4c073d3df7fb012f02b7b8636e9e5b04"
},
"res/raw-assets/textures/UI/lobby/user-image.png": {
size: 25205,
md5: "a488f02e3722fe6108cb17d92f94ba47"
},
"res/raw-assets/textures/UI/lobby/user-image2.png": {
size: 8755,
md5: "5e244875f0339e053b511be7f6757407"
},
"res/raw-assets/textures/UI/lobby/user-image3.png": {
size: 10878,
md5: "f5d719456ba026b007b3c411d0671153"
},
"res/raw-assets/textures/UI/lobby/user-image4.png": {
size: 9638,
md5: "6bed0fd7d1221112a99a6fb743a9d615"
},
"res/raw-assets/textures/UI/lobby/user-image5.png": {
size: 9754,
md5: "bd05dd20b2a5d315486cdbde5ee9933c"
},
"res/raw-assets/textures/UI/lobby/user-image6.png": {
size: 10370,
md5: "54120eb972495c03845eaf0d8f25405a"
},
"res/raw-assets/textures/UI/new/Stroke_photo.png": {
size: 1641,
md5: "e0c2c19a572a8a978a68afbd0e34069a"
},
"res/raw-assets/textures/UI/new/Stroke_photo_oneself.png": {
size: 10422,
md5: "cfd3e73de6518b301de7dded4b5ce392"
},
"res/raw-assets/textures/UI/new/bg_icon.png": {
size: 2711,
md5: "bfc16c6854c6e1e0e95130c16266612a"
},
"res/raw-assets/textures/UI/new/bg_rankinglist.png": {
size: 3765,
md5: "b07f8e27ba911157ac7090d82f394cbb"
},
"res/raw-assets/textures/UI/new/bg_xiamian.png": {
size: 3782,
md5: "81d98c57e21e5ebe15a7087660c82c61"
},
"res/raw-assets/textures/UI/new/fengexian.png": {
size: 15379,
md5: "d2ea7c8c18b389b54fe538e9a64a553c"
},
"res/raw-assets/textures/UI/new/icon_back.png": {
size: 2290,
md5: "a96d8745a2878f0e1a26caebeaf55462"
},
"res/raw-assets/textures/UI/new/icon_boy.png": {
size: 2187,
md5: "bf512a3db19ad66fad5a434e8760d2b7"
},
"res/raw-assets/textures/UI/new/rankinglist_bg.png": {
size: 1627,
md5: "f36f0460093a11eb58a76ffdfbdc6164"
},
"res/raw-assets/textures/UI/new/rankinglist_title.png": {
size: 7380,
md5: "fe805c3ec15c0452179d341948952112"
},
"res/raw-assets/textures/UI/table/bg_jinbishu.png": {
size: 1829,
md5: "b07b649a1bdd69bbfa2aa8f923dffa8e"
},
"res/raw-assets/textures/UI/user/circle_2.png": {
size: 55581,
md5: "f213f46f342cecadb0fe2943b1245561"
},
"res/raw-internal/image/default_btn_disabled.png": {
size: 1256,
md5: "ccbd56c4f14890bbc94d17004e501e9f"
},
"res/raw-internal/image/default_btn_normal.png": {
size: 1243,
md5: "ffdc9657918740e0f5d088acaaada3af"
},
"res/raw-internal/image/default_btn_pressed.png": {
size: 1156,
md5: "c1daa456037cc3884aabad81bb91b5cc"
},
"res/raw-internal/image/default_progressbar.png": {
size: 988,
md5: "67b4a8eb285b47bbcd7144512611c0a1"
},
"res/raw-internal/image/default_progressbar_bg.png": {
size: 996,
md5: "feadf32efa5c4557c81045711e5e6211"
}
},
searchPaths: []
});
cc.Class({
extends: cc.Component,
properties: {
panel: n,
manifestUrl: cc.RawAsset,
updateUI: cc.Node,
_updating: !1,
_canRetry: !1,
_storagePath: ""
},
checkCb: function(t) {
cc.log("Code: " + t.getEventCode());
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.panel.info.string = "No local manifest file found, hot update skipped.";
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.panel.info.string = "Fail to download manifest file, hot update skipped.";
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.panel.info.string = "Already up to date with the latest remote version.";
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.panel.info.string = "New version found, please try to update.";
this.panel.checkBtn.active = !1;
this.panel.fileProgress.progress = 0;
this.panel.byteProgress.progress = 0;
break;

default:
return;
}
cc.eventManager.removeListener(this._checkListener);
this._checkListener = null;
this._updating = !1;
},
updateCb: function(t) {
var e = !1, i = !1;
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.panel.info.string = "No local manifest file found, hot update skipped.";
i = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
this.panel.byteProgress.progress = t.getPercent();
this.panel.fileProgress.progress = t.getPercentByFile();
this.panel.fileLabel.string = t.getDownloadedFiles() + " / " + t.getTotalFiles();
this.panel.byteLabel.string = t.getDownloadedBytes() + " / " + t.getTotalBytes();
var n = t.getMessage();
n && (this.panel.info.string = "Updated file: " + n);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.panel.info.string = "Fail to download manifest file, hot update skipped.";
i = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.panel.info.string = "Already up to date with the latest remote version.";
i = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this.panel.info.string = "Update finished. " + t.getMessage();
e = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this.panel.info.string = "Update failed. " + t.getMessage();
this.panel.retryBtn.active = !0;
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
this.panel.info.string = "Asset update error: " + t.getAssetId() + ", " + t.getMessage();
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
this.panel.info.string = t.getMessage();
}
if (i) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
this._updating = !1;
}
if (e) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
var s = jsb.fileUtils.getSearchPaths(), a = this._am.getLocalManifest().getSearchPaths();
console.log(JSON.stringify(a));
Array.prototype.unshift(s, a);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(s));
jsb.fileUtils.setSearchPaths(s);
cc.audioEngine.stopAll();
cc.game.restart();
}
},
loadCustomManifest: function() {
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = new jsb.Manifest(s, this._storagePath);
this._am.loadLocalManifest(t, this._storagePath);
this.panel.info.string = "Using custom manifest";
}
},
retry: function() {
if (!this._updating && this._canRetry) {
this.panel.retryBtn.active = !1;
this._canRetry = !1;
this.panel.info.string = "Retry failed Assets...";
this._am.downloadFailedAssets();
}
},
checkUpdate: function() {
if (this._updating) this.panel.info.string = "Checking or updating ..."; else {
this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this.manifestUrl);
if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
cc.eventManager.addListener(this._checkListener, 1);
this._am.checkUpdate();
this._updating = !0;
} else this.panel.info.string = "Failed to load local manifest ...";
}
},
hotUpdate: function() {
if (this._am && !this._updating) {
this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
cc.eventManager.addListener(this._updateListener, 1);
this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this.manifestUrl);
this._failCount = 0;
this._am.update();
this.panel.updateBtn.active = !1;
this._updating = !0;
}
},
show: function() {
!1 === this.updateUI.active && (this.updateUI.active = !0);
},
onLoad: function() {
if (cc.sys.isNative) {
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "blackjack-remote-asset";
cc.log("Storage path for remote asset : " + this._storagePath);
this.versionCompareHandle = function(t, e) {
cc.log("JS Custom Version Compare: version A is " + t + ", version B is " + e);
for (var i = t.split("."), n = e.split("."), s = 0; s < i.length; ++s) {
var a = parseInt(i[s]), o = parseInt(n[s] || 0);
if (a !== o) return a - o;
}
return n.length > i.length ? -1 : 0;
};
this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS || this._am.retain();
var a = this.panel;
this._am.setVerifyCallback(function(t, e) {
var i = e.compressed, n = e.md5, s = e.path;
e.size;
if (i) {
a.info.string = "Verification passed : " + s;
return !0;
}
a.info.string = "Verification passed : " + s + " (" + n + ")";
return !0;
});
this.panel.info.string = "Hot update is ready, please check or directly update.";
if (cc.sys.os === cc.sys.OS_ANDROID) {
this._am.setMaxConcurrentTask(2);
this.panel.info.string = "Max concurrent tasks count have been limited to 2";
}
this.panel.fileProgress.progress = 0;
this.panel.byteProgress.progress = 0;
}
},
onDestroy: function() {
if (this._updateListener) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
}
this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS && this._am.release();
}
});
cc._RF.pop();
}, {
"../UI/UpdatePanel": "UpdatePanel"
} ],
InGameUI: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "f192efroeFEyaxtfh8TVXYz", "InGameUI");
var n = t("Game");
cc.Class({
extends: cc.Component,
properties: {
panelChat: {
default: null,
type: cc.Node
},
panelSocial: {
default: null,
type: cc.Node
},
betStateUI: {
default: null,
type: cc.Node
},
gameStateUI: {
default: null,
type: cc.Node
},
resultTxt: {
default: null,
type: cc.Label
},
betCounter: {
default: null,
type: cc.Node
},
btnStart: {
default: null,
type: cc.Node
},
labelTotalChips: {
default: null,
type: cc.Label
}
},
init: function(t) {
this.panelChat.active = !1;
this.panelSocial.active = !1;
this.resultTxt.enabled = !1;
this.betStateUI.active = !0;
this.gameStateUI.active = !1;
this.btnStart.active = !1;
this.betDuration = t;
this.progressTimer = this.initCountdown();
},
initCountdown: function() {
var t = n.instance.assetMng.texBetCountdown.getTexture();
this.sgCountdown = new _ccsg.Sprite(t);
this.sgCountdown.setColor(cc.Color.BLACK);
var e = new cc.ProgressTimer(this.sgCountdown);
e.setName("progressTimer");
e.setMidpoint(cc.p(.5, .5));
e.setType(cc.ProgressTimer.Type.RADIAL);
e.reverseDir = !0;
this.betCounter._sgNode.addChild(e);
e.setPosition(cc.p(0, -this.betCounter.height / 2));
e.setPercentage(0);
return e;
},
startCountdown: function() {
if (this.progressTimer) {
var t = cc.progressFromTo(this.betDuration, 0, 100);
this.progressTimer.runAction(t);
}
},
resetCountdown: function() {
if (this.progressTimer) {
this.progressTimer.stopAllActions();
this.progressTimer.setPercentage(100);
}
},
showBetState: function() {
this.betStateUI.active = !0;
this.gameStateUI.active = !1;
this.btnStart.active = !1;
},
showGameState: function() {
this.betStateUI.active = !1;
this.gameStateUI.active = !0;
this.btnStart.active = !1;
},
showResultState: function() {
this.betStateUI.active = !1;
this.gameStateUI.active = !1;
this.btnStart.active = !0;
},
toggleChat: function() {
this.panelChat.active = !this.panelChat.active;
},
toggleSocial: function() {
this.panelSocial.active = !this.panelSocial.active;
},
update: function(t) {}
});
cc._RF.pop();
}, {
Game: "Game"
} ],
Mask: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "3c16c3le6hCsrtnanqK8N2W", "Mask");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.node.on("touchstart", function(t) {
t.stopPropagation();
});
this.node.on("mousedown", function(t) {
t.stopPropagation();
});
this.node.on("mousemove", function(t) {
t.stopPropagation();
});
this.node.on("mouseup", function(t) {
t.stopPropagation();
});
}
});
cc._RF.pop();
}, {} ],
Menu: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "20f60m+3RlGO7x2/ARzZ6Qc", "Menu");
cc.Class({
extends: cc.Component,
properties: {
audioMng: {
default: null,
type: cc.Node
}
},
onLoad: function() {
this.audioMng = this.audioMng.getComponent("AudioMng");
this.audioMng.playMusic();
},
playGame: function() {
cc.director.loadScene("table");
},
update: function(t) {}
});
cc._RF.pop();
}, {} ],
PlayerData: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "4f9c5eXxqhHAKLxZeRmgHDB", "PlayerData");
e.exports = {
players: [ {
name: "燃烧吧，蛋蛋儿军",
gold: 3e3,
photoIdx: 0
}, {
name: "地方政府",
gold: 2e3,
photoIdx: 1
}, {
name: "手机超人",
gold: 1500,
photoIdx: 2
}, {
name: "天灵灵，地灵灵",
gold: 500,
photoIdx: 3
}, {
name: "哟哟，切克闹",
gold: 9e3,
photoIdx: 4
}, {
name: "学姐不要死",
gold: 5e3,
photoIdx: 5
}, {
name: "提百万",
gold: 1e4,
photoIdx: 6
} ]
};
cc._RF.pop();
}, {} ],
Player: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "226a2AvzRpHL7SJGTMy5PDX", "Player");
var n = t("Actor");
cc.Class({
extends: n,
init: function() {
this._super();
this.labelStake = this.renderer.labelStakeOnTable;
this.stakeNum = 0;
},
reset: function() {
this._super();
this.resetStake();
},
addCard: function(t) {
this._super(t);
},
addStake: function(t) {
this.stakeNum += t;
this.updateStake(this.stakeNum);
},
resetStake: function(t) {
this.stakeNum = 0;
this.updateStake(this.stakeNum);
},
updateStake: function(t) {
this.labelStake.string = t;
}
});
cc._RF.pop();
}, {
Actor: "Actor"
} ],
RankItem: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "1657ewfijBOXLq5zGqr6PvE", "RankItem");
cc.Class({
extends: cc.Component,
properties: {
spRankBG: {
default: null,
type: cc.Sprite
},
labelRank: {
default: null,
type: cc.Label
},
labelPlayerName: {
default: null,
type: cc.Label
},
labelGold: {
default: null,
type: cc.Label
},
spPlayerPhoto: {
default: null,
type: cc.Sprite
},
texRankBG: {
default: [],
type: cc.SpriteFrame
},
texPlayerPhoto: {
default: [],
type: cc.SpriteFrame
}
},
init: function(t, e) {
if (t < 3) {
this.labelRank.node.active = !1;
this.spRankBG.spriteFrame = this.texRankBG[t];
} else {
this.labelRank.node.active = !0;
this.labelRank.string = (t + 1).toString();
}
this.labelPlayerName.string = e.name;
this.labelGold.string = e.gold.toString();
this.spPlayerPhoto.spriteFrame = this.texPlayerPhoto[e.photoIdx];
},
update: function(t) {}
});
cc._RF.pop();
}, {} ],
RankList: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "fe3fcIxCFFLrKHg6s5+xRUU", "RankList");
var n = t("PlayerData").players;
cc.Class({
extends: cc.Component,
properties: {
scrollView: {
default: null,
type: cc.ScrollView
},
prefabRankItem: {
default: null,
type: cc.Prefab
},
rankCount: 0
},
onLoad: function() {
this.content = this.scrollView.content;
this.populateList();
},
populateList: function() {
for (var t = 0; t < this.rankCount; ++t) {
var e = n[t], i = cc.instantiate(this.prefabRankItem);
i.getComponent("RankItem").init(t, e);
this.content.addChild(i);
}
},
update: function(t) {}
});
cc._RF.pop();
}, {
PlayerData: "PlayerData"
} ],
SideSwitcher: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "3aae7lZKyhPqqsLD3wMKl6X", "SideSwitcher");
cc.Class({
extends: cc.Component,
properties: {
retainSideNodes: {
default: [],
type: cc.Node
}
},
switchSide: function() {
this.node.scaleX = -this.node.scaleX;
for (var t = 0; t < this.retainSideNodes.length; ++t) {
var e = this.retainSideNodes[t];
e.scaleX = -e.scaleX;
}
}
});
cc._RF.pop();
}, {} ],
TossChip: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "b4eb5Lo6U1IZ4eJWuxShCdH", "TossChip");
cc.Class({
extends: cc.Component,
properties: {
anim: {
default: null,
type: cc.Animation
}
},
play: function() {
this.anim.play("chip_toss");
}
});
cc._RF.pop();
}, {} ],
Types: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "5b633QMQxpFmYetofEvK2UD", "Types");
var n = cc.Enum({
Spade: 1,
Heart: 2,
Club: 3,
Diamond: 4
}), s = "NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");
function a(t, e) {
Object.defineProperties(this, {
point: {
value: t,
writable: !1
},
suit: {
value: e,
writable: !1
},
id: {
value: 13 * (e - 1) + (t - 1),
writable: !1
},
pointName: {
get: function() {
return s[this.point];
}
},
suitName: {
get: function() {
return n[this.suit];
}
},
isBlackSuit: {
get: function() {
return this.suit === n.Spade || this.suit === n.Club;
}
},
isRedSuit: {
get: function() {
return this.suit === n.Heart || this.suit === n.Diamond;
}
}
});
}
a.prototype.toString = function() {
return this.suitName + " " + this.pointName;
};
var o = new Array(52);
a.fromId = function(t) {
return o[t];
};
(function() {
for (var t = 1; t <= 4; t++) for (var e = 1; e <= 13; e++) {
var i = new a(e, t);
o[i.id] = i;
}
})();
var r = cc.Enum({
Normal: -1,
Stand: -1,
Report: -1,
Bust: -1
}), c = cc.Enum({
Win: -1,
Lose: -1,
Tie: -1
}), u = cc.Enum({
Normal: -1,
BlackJack: -1,
FiveCard: -1
});
e.exports = {
Suit: n,
Card: a,
ActorPlayingState: r,
Hand: u,
Outcome: c
};
cc._RF.pop();
}, {} ],
UpdatePanel: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "2db08jFZqNN+rw8vpeF4j70", "UpdatePanel");
e.exports = cc.Class({
extends: cc.Component,
properties: {
info: cc.Label,
fileProgress: cc.ProgressBar,
fileLabel: cc.Label,
byteProgress: cc.ProgressBar,
byteLabel: cc.Label,
close: cc.Node,
checkBtn: cc.Node,
retryBtn: cc.Node,
updateBtn: cc.Node
},
onLoad: function() {
this.close.on(cc.Node.EventType.TOUCH_END, function() {
this.node.parent.active = !1;
}, this);
}
});
cc._RF.pop();
}, {} ],
Utils: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "73590esk6xP9ICqhfUZalMg", "Utils");
e.exports = {
isBust: function(t) {
for (var e = 0, i = 0; i < t.length; i++) {
var n = t[i];
e += Math.min(10, n.point);
}
return 21 < e;
},
getMinMaxPoint: function(t) {
for (var e = !1, i = 0, n = 0; n < t.length; n++) {
var s = t[n];
1 === s.point && (e = !0);
i += Math.min(10, s.point);
}
var a = i;
e && i + 10 <= 21 && (a += 10);
return {
min: i,
max: a
};
},
isMobile: function() {
return cc.sys.isMobile;
}
};
cc._RF.pop();
}, {} ],
"game-fsm": [ function(t, e, i) {
"use strict";
cc._RF.push(e, "6510d1SmQRMMYH8FEIA7zXq", "game-fsm");
var c, u, d, l = t("state.com");
function h(e) {
return function(t) {
return t === e;
};
}
var n = !1;
i = {
init: function(t) {
l.console = console;
u = new l.StateMachine("root");
var e = new l.PseudoState("init-root", u, l.PseudoStateKind.Initial), i = new l.State("下注", u);
d = new l.State("已开局", u);
var n = new l.State("结算", u);
e.to(i);
i.to(d).when(h("deal"));
d.to(n).when(h("end"));
n.to(i).when(h("bet"));
i.entry(function() {
t.onBetState(!0);
});
i.exit(function() {
t.onBetState(!1);
});
n.entry(function() {
t.onEndState(!0);
});
n.exit(function() {
t.onEndState(!1);
});
var s = new l.PseudoState("init 已开局", d, l.PseudoStateKind.Initial), a = new l.State("发牌", d), o = new l.State("玩家决策", d), r = new l.State("庄家决策", d);
s.to(a);
a.to(o).when(h("dealed"));
o.to(r).when(h("player acted"));
a.entry(function() {
t.onEnterDealState();
});
o.entry(function() {
t.onPlayersTurnState(!0);
});
o.exit(function() {
t.onPlayersTurnState(!1);
});
r.entry(function() {
t.onEnterDealersTurnState();
});
c = new l.StateMachineInstance("fsm");
l.initialise(u, c);
},
toDeal: function() {
this._evaluate("deal");
},
toBet: function() {
this._evaluate("bet");
},
onDealed: function() {
this._evaluate("dealed");
},
onPlayerActed: function() {
this._evaluate("player acted");
},
onDealerActed: function() {
this._evaluate("end");
},
_evaluate: function(t) {
if (n) setTimeout(function() {
l.evaluate(u, c, t);
}, 1); else {
n = !0;
l.evaluate(u, c, t);
n = !1;
}
},
_getInstance: function() {
return c;
},
_getModel: function() {
return u;
}
};
e.exports = i;
cc._RF.pop();
}, {
"state.com": "state.com"
} ],
"state.com": [ function(t, e, i) {
"use strict";
cc._RF.push(e, "71d9293mx9CFryhJvRw85ZS", "state.com");
var n, s, a, o;
n = k || (k = {}), s = function() {
function e(t) {
this.actions = [];
t && this.push(t);
}
e.prototype.push = function(t) {
Array.prototype.push.apply(this.actions, t instanceof e ? t.actions : arguments);
return this;
};
e.prototype.hasActions = function() {
return 0 !== this.actions.length;
};
e.prototype.invoke = function(e, i, n) {
void 0 === n && (n = !1);
this.actions.forEach(function(t) {
return t(e, i, n);
});
};
return e;
}(), n.Behavior = s;
(function(t) {
(function(t) {
t[t.Initial = 0] = "Initial";
t[t.ShallowHistory = 1] = "ShallowHistory";
t[t.DeepHistory = 2] = "DeepHistory";
t[t.Choice = 3] = "Choice";
t[t.Junction = 4] = "Junction";
t[t.Terminate = 5] = "Terminate";
})(t.PseudoStateKind || (t.PseudoStateKind = {}));
t.PseudoStateKind;
})(k || (k = {}));
(function(t) {
(function(t) {
t[t.Internal = 0] = "Internal";
t[t.Local = 1] = "Local";
t[t.External = 2] = "External";
})(t.TransitionKind || (t.TransitionKind = {}));
t.TransitionKind;
})(k || (k = {}));
a = k || (k = {}), o = function() {
function i(t, e) {
this.name = t;
this.qualifiedName = e ? e.qualifiedName + i.namespaceSeparator + t : t;
}
i.prototype.toString = function() {
return this.qualifiedName;
};
i.namespaceSeparator = ".";
return i;
}(), a.Element = o;
var r, c, u, d, l, h, p, f, b, g, m, y, v, C, S, _, w, P, I, R, k, T = function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
function n() {
this.constructor = t;
}
n.prototype = e.prototype;
t.prototype = new n();
};
r = k || (k = {}), c = function(i) {
T(t, i);
function t(t, e) {
i.call(this, t, e);
this.vertices = [];
this.state = e;
this.state.regions.push(this);
this.state.getRoot().clean = !1;
}
t.prototype.getRoot = function() {
return this.state.getRoot();
};
t.prototype.accept = function(t, e, i, n) {
return t.visitRegion(this, e, i, n);
};
t.defaultName = "default";
return t;
}(r.Element), r.Region = c;
u = k || (k = {}), d = function(i) {
T(t, i);
function t(t, e) {
i.call(this, t, e = e instanceof u.State ? e.defaultRegion() : e);
this.outgoing = [];
this.region = e;
if (this.region) {
this.region.vertices.push(this);
this.region.getRoot().clean = !1;
}
}
t.prototype.getRoot = function() {
return this.region.getRoot();
};
t.prototype.to = function(t, e) {
void 0 === e && (e = u.TransitionKind.External);
return new u.Transition(this, t, e);
};
t.prototype.accept = function(t, e, i, n) {};
return t;
}(u.Element), u.Vertex = d;
l = k || (k = {}), h = function(n) {
T(t, n);
function t(t, e, i) {
void 0 === i && (i = l.PseudoStateKind.Initial);
n.call(this, t, e);
this.kind = i;
}
t.prototype.isHistory = function() {
return this.kind === l.PseudoStateKind.DeepHistory || this.kind === l.PseudoStateKind.ShallowHistory;
};
t.prototype.isInitial = function() {
return this.kind === l.PseudoStateKind.Initial || this.isHistory();
};
t.prototype.accept = function(t, e, i, n) {
return t.visitPseudoState(this, e, i, n);
};
return t;
}(l.Vertex), l.PseudoState = h;
p = k || (k = {}), f = function(i) {
T(t, i);
function t(t, e) {
i.call(this, t, e);
this.exitBehavior = new p.Behavior();
this.entryBehavior = new p.Behavior();
this.regions = [];
}
t.prototype.defaultRegion = function() {
return this.regions.reduce(function(t, e) {
return e.name === p.Region.defaultName ? e : t;
}, void 0) || new p.Region(p.Region.defaultName, this);
};
t.prototype.isFinal = function() {
return 0 === this.outgoing.length;
};
t.prototype.isSimple = function() {
return 0 === this.regions.length;
};
t.prototype.isComposite = function() {
return 0 < this.regions.length;
};
t.prototype.isOrthogonal = function() {
return 1 < this.regions.length;
};
t.prototype.exit = function(t) {
this.exitBehavior.push(t);
this.getRoot().clean = !1;
return this;
};
t.prototype.entry = function(t) {
this.entryBehavior.push(t);
this.getRoot().clean = !1;
return this;
};
t.prototype.accept = function(t, e, i, n) {
return t.visitState(this, e, i, n);
};
return t;
}(p.Vertex), p.State = f;
b = k || (k = {}), g = function(i) {
T(t, i);
function t(t, e) {
i.call(this, t, e);
}
t.prototype.accept = function(t, e, i, n) {
return t.visitFinalState(this, e, i, n);
};
return t;
}(b.State), b.FinalState = g;
m = k || (k = {}), y = function(e) {
T(t, e);
function t(t) {
e.call(this, t, void 0);
this.clean = !1;
}
t.prototype.getRoot = function() {
return this.region ? this.region.getRoot() : this;
};
t.prototype.accept = function(t, e, i, n) {
return t.visitStateMachine(this, e, i, n);
};
return t;
}(m.State), m.StateMachine = y;
v = k || (k = {}), C = function() {
function s(t, e, i) {
var n = this;
void 0 === i && (i = v.TransitionKind.External);
this.transitionBehavior = new v.Behavior();
this.onTraverse = new v.Behavior();
this.source = t;
this.target = e;
this.kind = e ? i : v.TransitionKind.Internal;
this.guard = t instanceof v.PseudoState ? s.TrueGuard : function(t) {
return t === n.source;
};
this.source.outgoing.push(this);
this.source.getRoot().clean = !1;
}
s.prototype.else = function() {
this.guard = s.FalseGuard;
return this;
};
s.prototype.when = function(t) {
this.guard = t;
return this;
};
s.prototype.effect = function(t) {
this.transitionBehavior.push(t);
this.source.getRoot().clean = !1;
return this;
};
s.prototype.accept = function(t, e, i, n) {
return t.visitTransition(this, e, i, n);
};
s.prototype.toString = function() {
return "[" + (this.target ? this.source + " -> " + this.target : this.source) + "]";
};
s.TrueGuard = function() {
return !0;
};
s.FalseGuard = function() {
return !1;
};
return s;
}(), v.Transition = C;
S = k || (k = {}), _ = function() {
function t() {}
t.prototype.visitElement = function(t, e, i, n) {};
t.prototype.visitRegion = function(t, e, i, n) {
var s = this, a = this.visitElement(t, e, i, n);
t.vertices.forEach(function(t) {
t.accept(s, e, i, n);
});
return a;
};
t.prototype.visitVertex = function(t, e, i, n) {
var s = this, a = this.visitElement(t, e, i, n);
t.outgoing.forEach(function(t) {
t.accept(s, e, i, n);
});
return a;
};
t.prototype.visitPseudoState = function(t, e, i, n) {
return this.visitVertex(t, e, i, n);
};
t.prototype.visitState = function(t, e, i, n) {
var s = this, a = this.visitVertex(t, e, i, n);
t.regions.forEach(function(t) {
t.accept(s, e, i, n);
});
return a;
};
t.prototype.visitFinalState = function(t, e, i, n) {
return this.visitState(t, e, i, n);
};
t.prototype.visitStateMachine = function(t, e, i, n) {
return this.visitState(t, e, i, n);
};
t.prototype.visitTransition = function(t, e, i, n) {};
return t;
}(), S.Visitor = _;
w = k || (k = {}), P = function() {
function t(t) {
void 0 === t && (t = "unnamed");
this.last = {};
this.isTerminated = !1;
this.name = t;
}
t.prototype.setCurrent = function(t, e) {
this.last[t.qualifiedName] = e;
};
t.prototype.getCurrent = function(t) {
return this.last[t.qualifiedName];
};
t.prototype.toString = function() {
return this.name;
};
return t;
}(), w.StateMachineInstance = P;
(function(t) {
t.setRandom = function(t) {
e = t;
};
t.getRandom = function() {
return e;
};
var e = function(t) {
return Math.floor(Math.random() * t);
};
})(k || (k = {}));
(I = k || (k = {})).isActive = function t(e, i) {
return e instanceof I.Region ? t(e.state, i) : e instanceof I.State ? !e.region || t(e.region, i) && i.getCurrent(e.region) === e : void 0;
};
(R = k || (k = {})).isComplete = function e(t, i) {
return t instanceof R.Region ? i.getCurrent(t).isFinal() : !(t instanceof R.State) || t.regions.every(function(t) {
return e(t, i);
});
};
(function(r) {
function s(t, e, i) {
void 0 === i && (i = !0);
if (e) {
i && !1 === t.clean && s(t);
r.console.log("initialise " + e);
t.onInitialise.invoke(void 0, e);
} else {
r.console.log("initialise " + t.name);
t.accept(new n(), !1);
t.clean = !0;
}
}
r.initialise = s;
r.evaluate = function(t, e, i, n) {
void 0 === n && (n = !0);
r.console.log(e + " evaluate " + i);
n && !1 === t.clean && s(t);
return !e.isTerminated && a(t, e, i);
};
function a(e, i, n) {
var s = !1;
e.regions.every(function(t) {
if (a(i.getCurrent(t), i, n)) {
s = !0;
return r.isActive(e, i);
}
return !0;
});
if (s) n !== e && r.isComplete(e, i) && a(e, i, e); else {
var t = e.outgoing.filter(function(t) {
return t.guard(n, i);
});
1 === t.length ? s = o(t[0], i, n) : 1 < t.length && r.console.error(e + ": multiple outbound transitions evaluated true for message " + n);
}
return s;
}
function o(t, e, i) {
for (var n = new r.Behavior(t.onTraverse), s = t.target; s && s instanceof r.PseudoState && s.kind === r.PseudoStateKind.Junction; ) {
s = (t = c(s, e, i)).target;
n.push(t.onTraverse);
}
n.invoke(i, e);
s && s instanceof r.PseudoState && s.kind === r.PseudoStateKind.Choice ? o(c(s, e, i), e, i) : s && s instanceof r.State && r.isComplete(s, e) && a(s, e, s);
return !0;
}
function c(t, e, i) {
var n = t.outgoing.filter(function(t) {
return t.guard(i, e);
});
if (t.kind === r.PseudoStateKind.Choice) return 0 !== n.length ? n[r.getRandom()(n.length)] : u(t);
if (!(1 < n.length)) return n[0] || u(t);
r.console.error("Multiple outbound transition guards returned true at " + this + " for " + i);
}
function u(t) {
return t.outgoing.filter(function(t) {
return t.guard === r.Transition.FalseGuard;
})[0];
}
function d(t) {
return t[0] || (t[0] = new r.Behavior());
}
function l(t) {
return t[1] || (t[1] = new r.Behavior());
}
function h(t) {
return t[2] || (t[2] = new r.Behavior());
}
function p(t) {
return new r.Behavior(l(t)).push(h(t));
}
function f(t) {
return (t.region ? f(t.region.state) : []).concat(t);
}
var b = function(t) {
T(e, t);
function e() {
t.apply(this, arguments);
}
e.prototype.visitTransition = function(t, e) {
t.kind === r.TransitionKind.Internal ? t.onTraverse.push(t.transitionBehavior) : t.kind === r.TransitionKind.Local ? this.visitLocalTransition(t, e) : this.visitExternalTransition(t, e);
};
e.prototype.visitLocalTransition = function(s, a) {
var o = this;
s.onTraverse.push(function(e, i) {
for (var t = f(s.target), n = 0; r.isActive(t[n], i); ) ++n;
d(a(i.getCurrent(t[n].region))).invoke(e, i);
s.transitionBehavior.invoke(e, i);
for (;n < t.length; ) o.cascadeElementEntry(s, a, t[n++], t[n], function(t) {
t.invoke(e, i);
});
h(a(s.target)).invoke(e, i);
});
};
e.prototype.visitExternalTransition = function(e, t) {
for (var i = f(e.source), n = f(e.target), s = Math.min(i.length, n.length) - 1; i[s - 1] !== n[s - 1]; ) --s;
e.onTraverse.push(d(t(i[s])));
e.onTraverse.push(e.transitionBehavior);
for (;s < n.length; ) this.cascadeElementEntry(e, t, n[s++], n[s], function(t) {
return e.onTraverse.push(t);
});
e.onTraverse.push(h(t(e.target)));
};
e.prototype.cascadeElementEntry = function(t, e, i, n, s) {
s(l(e(i)));
n && i instanceof r.State && i.regions.forEach(function(t) {
s(l(e(t)));
t !== n.region && s(h(e(t)));
});
};
return e;
}(r.Visitor), n = function(n) {
T(t, n);
function t() {
n.apply(this, arguments);
this.behaviours = {};
}
t.prototype.behaviour = function(t) {
return this.behaviours[t.qualifiedName] || (this.behaviours[t.qualifiedName] = []);
};
t.prototype.visitElement = function(i, t) {
if (r.console !== e) {
d(this.behaviour(i)).push(function(t, e) {
return r.console.log(e + " leave " + i);
});
l(this.behaviour(i)).push(function(t, e) {
return r.console.log(e + " enter " + i);
});
}
};
t.prototype.visitRegion = function(n, e) {
var s = this, a = n.vertices.reduce(function(t, e) {
return e instanceof r.PseudoState && e.isInitial() ? e : t;
}, void 0);
n.vertices.forEach(function(t) {
t.accept(s, e || a && a.kind === r.PseudoStateKind.DeepHistory);
});
d(this.behaviour(n)).push(function(t, e) {
return d(s.behaviour(e.getCurrent(n))).invoke(t, e);
});
e || !a || a.isHistory() ? h(this.behaviour(n)).push(function(t, e, i) {
p(s.behaviour((i || a.isHistory()) && e.getCurrent(n) || a)).invoke(t, e, i || a.kind === r.PseudoStateKind.DeepHistory);
}) : h(this.behaviour(n)).push(p(this.behaviour(a)));
this.visitElement(n, e);
};
t.prototype.visitPseudoState = function(i, t) {
n.prototype.visitPseudoState.call(this, i, t);
i.isInitial() ? h(this.behaviour(i)).push(function(t, e) {
return o(i.outgoing[0], e);
}) : i.kind === r.PseudoStateKind.Terminate && l(this.behaviour(i)).push(function(t, e) {
return e.isTerminated = !0;
});
};
t.prototype.visitState = function(i, e) {
var n = this;
i.regions.forEach(function(t) {
t.accept(n, e);
d(n.behaviour(i)).push(d(n.behaviour(t)));
h(n.behaviour(i)).push(p(n.behaviour(t)));
});
this.visitVertex(i, e);
d(this.behaviour(i)).push(i.exitBehavior);
l(this.behaviour(i)).push(i.entryBehavior);
l(this.behaviour(i)).push(function(t, e) {
i.region && e.setCurrent(i.region, i);
});
};
t.prototype.visitStateMachine = function(t, e) {
var i = this;
n.prototype.visitStateMachine.call(this, t, e);
t.accept(new b(), function(t) {
return i.behaviour(t);
});
t.onInitialise = p(this.behaviour(t));
};
return t;
}(r.Visitor), e = {
log: function(t) {
for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
},
warn: function(t) {
for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
},
error: function(t) {
for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
throw t;
}
};
r.console = e;
})(k || (k = {}));
(function(s) {
s.validate = function(t) {
t.accept(new e());
};
var e = function(n) {
T(t, n);
function t() {
n.apply(this, arguments);
}
t.prototype.visitPseudoState = function(t) {
n.prototype.visitPseudoState.call(this, t);
if (t.kind === s.PseudoStateKind.Choice || t.kind === s.PseudoStateKind.Junction) {
0 === t.outgoing.length && s.console.error(t + ": " + t.kind + " pseudo states must have at least one outgoing transition.");
1 < t.outgoing.filter(function(t) {
return t.guard === s.Transition.FalseGuard;
}).length && s.console.error(t + ": " + t.kind + " pseudo states cannot have more than one Else transitions.");
} else {
0 !== t.outgoing.filter(function(t) {
return t.guard === s.Transition.FalseGuard;
}).length && s.console.error(t + ": " + t.kind + " pseudo states cannot have Else transitions.");
t.isInitial() && (1 !== t.outgoing.length ? s.console.error(t + ": initial pseudo states must have one outgoing transition.") : t.outgoing[0].guard !== s.Transition.TrueGuard && s.console.error(t + ": initial pseudo states cannot have a guard condition."));
}
};
t.prototype.visitRegion = function(e) {
n.prototype.visitRegion.call(this, e);
var i;
e.vertices.forEach(function(t) {
if (t instanceof s.PseudoState && t.isInitial()) {
i && s.console.error(e + ": regions may have at most one initial pseudo state.");
i = t;
}
});
};
t.prototype.visitState = function(t) {
n.prototype.visitState.call(this, t);
1 < t.regions.filter(function(t) {
return t.name === s.Region.defaultName;
}).length && s.console.error(t + ": a state cannot have more than one region named " + s.Region.defaultName);
};
t.prototype.visitFinalState = function(t) {
n.prototype.visitFinalState.call(this, t);
0 !== t.outgoing.length && s.console.error(t + ": final states must not have outgoing transitions.");
0 !== t.regions.length && s.console.error(t + ": final states must not have child regions.");
t.entryBehavior.hasActions() && s.console.warn(t + ": final states may not have entry behavior.");
t.exitBehavior.hasActions() && s.console.warn(t + ": final states may not have exit behavior.");
};
t.prototype.visitTransition = function(t) {
n.prototype.visitTransition.call(this, t);
t.kind === s.TransitionKind.Local && -1 === function t(e) {
return (e.region ? t(e.region.state) : []).concat(e);
}(t.target).indexOf(t.source) && s.console.error(t + ": local transition target vertices must be a child of the source composite sate.");
};
return t;
}(s.Visitor);
})(k || (k = {}));
e.exports = k;
cc._RF.pop();
}, {} ]
}, {}, [ "Actor", "ActorRenderer", "AssetMng", "AudioMng", "Bet", "Card", "CounterTest", "Dealer", "FXPlayer", "Game", "Menu", "Player", "SideSwitcher", "TossChip", "ButtonScaler", "InGameUI", "RankItem", "RankList", "UpdatePanel", "state.com", "Decks", "HotUpdate", "Mask", "PlayerData", "Types", "Utils", "game-fsm" ]);