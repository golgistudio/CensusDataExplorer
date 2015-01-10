/**
 * Created by laurie on 12/16/2014.
 */

var bridgeQuizTestData = {
    "title": "Bridge Quiz",
    "description": "Explore ",
    "questions" :
        [

            {
                "order": 1,
                "image": "images/bridges/George_Washington_Bridge_from_New_Jersey-edit.jpg",
                "imageCitation":  "George Washington Bridge from New Jersey-edit by John O'Connell - originally posted to Flickr as George Washington Bridge from New Jersey. Licensed under CC BY 2.0 via Wikimedia Commons - http://commons.wikimedia.org/wiki/File:George_Washington_Bridge_from_New_Jersey-edit.jpg#mediaviewer/File:George_Washington_Bridge_from_New_Jersey-edit.jpg",
                "question": "Which of the following is not true about the building of the Golden Gate Bridge?",
                "answer" : "hardHats",
                "choicesHaveImages": false,
                "references" :
                    [
                        {
                            "text": "History - Six things you may not know about the Golden Gate",
                            "link": "http://www.history.com/news/6-things-you-may-not-know-about-the-golden-gate-bridge"
                        },
                        {
                            "text": "Golden Gate Bridge - hard hats",
                            "link": "http://goldengatebridge.org/research/facts.php#hardhats"
                        }
                    ],

                "choices":
                    [

                        {
                            "id": "safetyNet",
                            "description" : "A safety net saved more than a dozen lives during construction.",
                            "order": 1,
                            "imageCitation": "",
                            "image": ""

                        },

                        {
                            "id": "fogHorns",
                            "description" : "Fog horns are attached to the south tower pier.",
                            "order": 2,
                            "imageCitation": "",
                            "image": ""
                        },

                        {
                            "id": "rivets",
                            "description" : "There are over a million rivets between the two towers.",
                            "order": 3,
                            "imageCitation": "",
                            "image": ""
                        },

                        {
                            "id": "hardHats",
                            "description" : "Hard hats were not required during its construction in the late 1930's.",
                            "order": 4,
                            "imageCitation": "",
                            "image": ""
                        }
                    ]
            },

            {
                "order": 2,
                "image": "images/bridges/George_Washington_Bridge_from_New_Jersey-edit.jpg",
                "imageCitation":  "George Washington Bridge from New Jersey-edit by John O'Connell - originally posted to Flickr as George Washington Bridge from New Jersey. Licensed under CC BY 2.0 via Wikimedia Commons - http://commons.wikimedia.org/wiki/File:George_Washington_Bridge_from_New_Jersey-edit.jpg#mediaviewer/File:George_Washington_Bridge_from_New_Jersey-edit.jpg",
                "question": "Which president is this bridge that connects New Jersey and New York named after?",
                "answer" : "georgeWashington",
                "choicesHaveImages": true,
                "references" :
                    [
                        {
                            "test": "",
                            "link": "http://www.panynj.gov/bridges-tunnels/gwb-history.html"
                        }
                    ],

                "choices":
                    [

                        {
                            "id": "georgeWashington",
                            "description" : "George Washington.",
                            "order": 1,
                            "imageCitation": "",
                            "image": "images/bridges/GeorgeWashington.jpg"
                        },

                        {
                            "id": "johnAdams",
                            "description" : "John Adams",
                            "order": 2,
                            "imageCitation": "",
                            "image": "images/bridges/JohnAdams.jpg"
                        },

                        {
                            "id": "johnKennedy",
                            "description" : "John F. Kennedy",
                            "order": 3,
                            "imageCitation": "",
                            "image": "images/bridges/JohnKennedy.jpg"
                        },

                        {
                            "id": "woodrowWilson",
                            "description" : "Woodrow Wilson",
                            "order": 4,
                            "imageCitation": "",
                            "image": "images/bridges/WoodrowWilson.jpg"
                        }
                    ]
            }
        ]
}

module.exports = bridgeQuizTestData;
