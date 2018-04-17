"use strict";
var WebSocketServer = require('ws').Server
var requestId = require('./request-id')
var responseId = require('./response-id')

var wss = new WebSocketServer({ port: 8888 });

wss.on('connection', function (ws) {
    console.log("connection succeed");
    // 发送消息  
    ws.on('message', function (jsonStr, flags) {
        try {
            var jsonData = JSON.parse(jsonStr)

            var id = jsonData.id
            requestHandler[id](ws, jsonData.data)

            console.log(jsonStr);
        } catch (err) {
            console.log(jsonStr);
        }
    });
    // 退出聊天  
    ws.on('close', function (close) {
        try {
            // wss.broadcast(0,this.user.name);  
        } catch (e) {
            console.log('刷新页面了');
        }
    });
});


var requestHandler = {}
requestHandler[requestId.LOGIN] = (ws, data) => {
    ws.send(JSON.stringify(
        {
            id: responseId.LOGIN,
            data: {
                player: {
                    id: 1,
                    name: "player self",
                    headImgUrl: "http://img4.imgtn.bdimg.com/it/u=328179059,3377101288&fm=214&gp=0.jpg"
                }
            }
        }
    ))
}

// required uint32 ownerId = 2;
// required uint32 playerNum = 3;
// required uint32 round = 4;
// required message.DouNiuCardPattern cardPattern = 5;
// required message.DouNiuQiangZhuang qiangZhuang = 6;
// required string rule = 7;
// repeated message.RoomPlayerStatusInfo roomPlayerList = 8;
requestHandler[requestId.ROOMINFO] = (ws, data) => {
    ws.send(JSON.stringify(
        {
            id: responseId.ROOMINFO,
            data: {
                roomId: 1111,
                ownerId: 1,
                playerNum: 3,
                round: 2,
                cardPattern: 1,
                qiangZhuang: 2,     // 1-inturn, 2-look decide
                rule: "no rules",
                roomPlayerList: [
                    {
                        playerInfo: {
                            id: 1,
                            name: "player self",
                            headImgUrl: "http://img4.imgtn.bdimg.com/it/u=328179059,3377101288&fm=214&gp=0.jpg"
                        },
                        isReady: false
                    },
                    {
                        playerInfo: {
                            id: 2,
                            name: "player robot1",
                            headImgUrl: "http://pic.58pic.com/58pic/11/38/84/16w58PICegT.jpg"
                        },
                        isReady: true
                    },
                ]
            }
        }
    ))

    ws.send(JSON.stringify(
        {
            id: responseId.PLAYER_ENTER_ROOM,
            data: {
                playerInfo:
                    {
                        id: 3,
                        name: "player robot2",
                        headImgUrl: "https://b-ssl.duitang.com/uploads/item/201501/16/20150116012601_zrzZh.thumb.700_0.jpeg"
                    },
            }
        }
    ))

    ws.send(JSON.stringify(
        {
            id: responseId.PLAYER_READY,
            data: {
                text: "Player3 is ready",
                playerId: 3,
                isReady: true
            }
        }
    ))
}

this._roundId = 0
requestHandler[requestId.PLAYER_READY] = (ws, data) => {
    ws.send(JSON.stringify(
        {
            id: responseId.PLAYER_READY,
            data: {
                text: "You are ready",
                playerId: 1,
                isReady: data.isReady
            }
        }
    ))

    this._roundId += 1
    ws.send(JSON.stringify(
        {
            id: responseId.ROUND_BEGIN,
            data: {
                text: "all players ready, round begin, you will soon get the first 4 cards",
                roundId: this._roundId
            }
        }
    ))

    ws.send(JSON.stringify(
        {
            id: responseId.STARTING_HANDS,
            data: {
                text: "this is your first four cards",
                cardIdList: [4, 7, 33, 12]
            }
        }
    ))
}


// requestHandler[requestId.BEGINGAME] = (ws, data) => {
//     ws.send(JSON.stringify(
//         {
//             id: responseId.ROUND_BEGIN,
//             data: {
//                 text: "all players ready, round begin, you will soon get the first 4 cards",
//                 roundId: 1
//             }
//         }
//     ))

//     ws.send(JSON.stringify(
//         {
//             id: responseId.STARTING_HANDS,
//             data: {
//                 text: "this is your first four cards",
//                 cardIdList: [4, 7, 33, 12]
//             }
//         }
//     ))
// }


requestHandler[requestId.BANKER] = (ws, data) => {
    ws.send(JSON.stringify(
        {
            id: responseId.BANKER,
            data: {
                text: "banker is decided",
                bankerPlayerId: 3
            }
        }
    ))
}


requestHandler[requestId.STAKE] = (ws, data) => {
    ws.send(JSON.stringify(
        {
            id: responseId.STAKE,
            data: {
                text: "all players have staked",
                stakeInfoList: [
                    {
                        playerId: 1,
                        stake: data.stake
                    },
                    {
                        playerId: 2,
                        stake: 2
                    },
                    {
                        playerId: 3,
                        stake: 3
                    },
                ]
            }
        }
    ))

    ws.send(JSON.stringify(
        {
            id: responseId.FIFTH_CARD,
            data: {
                text: "you got the fifth card from server",
                cardId: 48
            }
        }
    ))
}


requestHandler[requestId.PLAYER_SHOW_DOWN] = (ws, data) => {
    ws.send(JSON.stringify(
        {
            id: responseId.PLAYER_SHOW_DOWN,
            data: {
                text: "all players have shown down, you know all the cards",
                showDownInfoList: [
                    {
                        playerId: 1,
                        cardIdList: [4, 7, 12, 33, 48],
                        cardLevel: 9
                    },
                    {
                        playerId: 2,
                        cardIdList: [14, 3, 7, 8, 11],
                        cardLevel: 8
                    },
                    {
                        playerId: 3,
                        cardIdList: [5, 47, 22, 8, 32],
                        cardLevel: 7
                    },
                ]
            }
        }
    ))

    if (this._roundId == 1)
        ws.send(JSON.stringify(
            {
                id: responseId.ROUND_END,
                data: {
                    text: "this round is end. you can check the score",
                    scoreList: [
                        {
                            playerId: 1,
                            stake: 1,
                            roundScore: 11,
                            totalScore: 111
                        },
                        {
                            playerId: 2,
                            stake: 2,
                            roundScore: 22,
                            totalScore: 222
                        },
                        {
                            playerId: 3,
                            stake: 3,
                            roundScore: 33,
                            totalScore: 333
                        },
                    ]
                }
            }
        ))

    if (this._roundId == 2)
        ws.send(JSON.stringify(
            {
                id: responseId.ROOM_END,
                data: {
                    text: "all the round in the room is end. you can check the score",
                    playerStatsList: [
                        {
                            playerId: 1,
                            statsWuXiao: 1,
                            statsWuHua: 1,
                            statsZhaDan: 1,
                            statsLevel10: 1,
                            statsLevel9: 1,
                            totalScore: 1111
                        },
                        {
                            playerId: 2,
                            statsWuXiao: 2,
                            statsWuHua: 2,
                            statsZhaDan: 2,
                            statsLevel10: 2,
                            statsLevel9: 2,
                            totalScore: 2222
                        },
                        {
                            playerId: 3,
                            statsWuXiao: 3,
                            statsWuHua: 3,
                            statsZhaDan: 3,
                            statsLevel10: 3,
                            statsLevel9: 3,
                            totalScore: 3333
                        },
                    ]
                }
            },
        ))
}




