/**
 * Created by laurie on 12/24/2014.
 */


/* global require, it, describe */


// comment out require statement when running from html page
var chai = require("chai") ;

var expect = chai.expect;


// comment out when running from html page
var QuizEngine = require("../source/scripts/quizEngine.js");
var bridgeQuizTestData = require("./data/bridgeQuizTestData.js");

describe("QuizEngine", function() {
    "use strict";
    var quizEngineObject = new QuizEngine(bridgeQuizTestData);
    describe("constructor-title", function() {
        it("title should be 'Bridge Quiz'", function() {

            expect(quizEngineObject.getTitle()).to.equal(bridgeQuizTestData.title);
        });
    });
    describe("number", function() {
        it("Number of questions should be '2'", function() {
            expect(quizEngineObject.numQuestions()).to.equal(2);
        });
    });
    describe("question", function() {
        it("First question answer should be 'hardhats' ", function() {
            expect(quizEngineObject.getQuestion(0).answer).to.equal("hardHats");
        });
    });
});
