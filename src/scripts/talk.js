// Description:
//   新規参加者用挨拶スクリプト
// Commands:
//   hubot start talk {first message} - start to talk with ray ex) hubot start talk ほげ
//   hubot stop talk - stop talking with ray
//

var request = require('request');

var getTimeDiff = function(oldMsec) {
    var now = new Date();
    var old = new Date(oldMsec);
    var diffMsec = now.getTime() - old.getTime();
    var diffMinutes = parseInt( diffMsec / (60*1000), 10 );
    return diffMinutes;
};

var DOCOMO_API_KEY = process.env.DOCOMO_API_KEY;
var KEY_DOCOMO_CONTEXT = 'chaos-docomo-talk-context';
var KEY_DOCOMO_CONTEXT_TTL = 'chaos-docomo-talk-context-ttl';
var TTL_MINUTES = 20;
var end = true;
var thinking = false;

module.exports = function(robot) {
    robot.hear(/(\S+)/i, function(msg) {
        if ( msg.message.user.id !== 'U0EGR6E5P' || end || thinking) {
            return;
        }
        var message = msg.match[1]
        if(!DOCOMO_API_KEY && message) {
            return 
        }
        thinking = true;
        var context = robot.brain.get(KEY_DOCOMO_CONTEXT) || '';
        var oldMsec     = robot.brain.get(KEY_DOCOMO_CONTEXT_TTL);
        var diffMinutes = getTimeDiff(oldMsec);
        if (diffMinutes > TTL_MINUTES) {
            context = ''
        }

        var url = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=' + DOCOMO_API_KEY
        var userName = msg.message.user.name
        request.post({
            url: url,
            json: {
                utt: message,
                nickname: userName,
                context: context
            }
        }, function(err, response, body) {
            robot.brain.set(KEY_DOCOMO_CONTEXT, body.context)
            nowMsec = new Date().getTime()
            robot.brain.set(KEY_DOCOMO_CONTEXT_TTL, nowMsec)
            thinking = false;
            msg.send("ray " +body.utt)
        });
    });

    robot.respond(/stop talk/i, function(msg) {
        end = true;
        msg.send("ちっこれくらいにしてやろう");
    });

    robot.respond(/start talk (\S+)/i, function(msg) {
        end = false;
        var message = msg.match[1]
        if(!DOCOMO_API_KEY && message) {
            return 
        }
        var context = robot.brain.get(KEY_DOCOMO_CONTEXT) || '';
        var oldMsec     = robot.brain.get(KEY_DOCOMO_CONTEXT_TTL);
        var diffMinutes = getTimeDiff(oldMsec);
        if (diffMinutes > TTL_MINUTES) {
            context = ''
        }

        var url = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=' + DOCOMO_API_KEY
        var userName = msg.message.user.name
        request.post({
            url: url,
            json: {
                utt: message,
                nickname: userName,
                context: context
            }
        }, function(err, response, body) {
            robot.brain.set(KEY_DOCOMO_CONTEXT, body.context)
            nowMsec = new Date().getTime()
            robot.brain.set(KEY_DOCOMO_CONTEXT_TTL, nowMsec)
            msg.send("ray " +body.utt)
        });

    });
}
