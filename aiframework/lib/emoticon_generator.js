'use strict';

const hopefulset = [':blush:', ':sweat_smile:', ':innocent:', ':blush:', ':slightly_smiling_face:', ':relaxed:', ':nerd_face:',':v:',':spock-hand:'];
const taskcompleteset = [':+1:',':grinning:',':grin:',':smiley:',':smile:',':innocent:',':blush:',':slightly_smiling_face:',':relaxed:',':relieved:',':v:', ':ok_hand:',':smirk:'];
const taskfailedset = [':no_mouth:',':neutral_face:',':expressionless:',':unamused:',':thinking_face:',':disappointed:',':worried:',':pensive:',':slightly_frowning_face:',':white_frowning_face:',':persevere:',':weary:',':scream:',':fearful:',':cold_sweat:',':dizzy_face:',':astonished:',':zipper_mouth_face:'];

let getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let getRandomEmoticons = function(type)
{
	let emoticons = '';
	let lowercasedtype = type.toLowerCase();
	
	// get a random number of emoticons --> do not exceed 4.!
	let numberOfEmoticons = getRandomInt(0, 4);
	
	// choose the set of emoticons you need;
	let emoticonSet;
	switch(lowercasedtype) {
	case 'hopeful':
		emoticonSet = hopefulset;
		break;
	case 'success':
		emoticonSet = taskcompleteset;
		break;
	case 'fail':
		emoticonSet = taskfailedset;
		break;
	}
	for(let i=0;i<numberOfEmoticons;i++)
	{
		// get a random emoticon from the emoticon set
		let emoticon = emoticonSet[getRandomInt(0, emoticonSet.length-1)];
		// append it to the emoticons
		emoticons = emoticons + emoticon;
	}
	
	return emoticons;
}

module.exports.getEmoticons = getRandomEmoticons;