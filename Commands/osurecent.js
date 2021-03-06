const Logger = require('../Logger.js');
const osu = require('node-osu');
const osuAPIKey = require('../Dependencies/osuAPIKey.json'); //Has APIKey under osuAPIKEY.key
const osuAPI = new osu.Api(osuAPIKey.key, {
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
    completeScores: true, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
    parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
});

const osuName = require("./getosuName.js");
const parseMods = require("./parseMods.js");

module.exports = {

    osurecent: async function(message) { //Gets most recent Play(passed or unpassed)

        name = osuName.getosuName(message);

        s = osuAPI.getUserRecent({ u: name }).then( //osuAPI-Call
            async result => {

                recentScore = result[0];

                var Acc = recentScore.accuracy * 100;


                let endMessage = "Score:    ".concat(recentScore.score)
                    .concat("\nCombo:    ").concat(recentScore.maxCombo)
                    .concat("\nTitle:    ").concat(recentScore.beatmap.title)
                    .concat("\nLink:      ").concat("https://osu.ppy.sh/beatmapsets/").concat(recentScore.beatmap.beatmapSetId)
                    .concat("\nDiff:     ").concat(recentScore.beatmap.version)
                    .concat("\nStarDiff: ").concat(recentScore.beatmap.difficulty.rating)
                    .concat("\nBPM:      ").concat(recentScore.beatmap.bpm)
                    .concat("\nAcc:      ").concat(Acc).concat("%")
                    .concat("\nMods:     ").concat(parseMods.parseMods(recentScore.mods));
                if (recentScore.pp != null) {
                    endMessage = endMessage.concat("\nPP:       ").concat(recentScore.pp);
                }
                return endMessage;
            }
        ).catch((error) => {
            Logger.log(error);
            message.channel.send("Username not found or this user has not played today!");
        });

        let result = await s; //wait for PromiseResolve
        message.channel.send(result);
    }
}