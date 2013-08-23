'use strict';
var mockUserData = angular.module('mockedUserData', []);

mockUserData.value('defaultJSON', {
		userResults:
		[
  {
  	"Id": 19,
  	"UserName": "user",
  	"FirstName": "FirstName",
  	"LastName": "LastName",
  	"DisplayName": "DisplayName",
  	"Salt": "cnotBA==",
  	"PasswordHash": "PGl1Qlms3LKClyswBAHzLhYbZdKNMgqujyeqa0SiYlU=",
  	"DigestHA1Hash": "c6b6c774413f357ebc92c725d0fa0745",
  	"Roles": [
      "admin"
  	],
  	"Permissions": [
      "ThePermission"
  	],
  	"CreatedDate": "/Date(1376987207535)/",
  	"ModifiedDate": "/Date(1377091957039)/",
  	"Meta": {
  		"Active": "False"
  	}
  },
  {
  	"Id": 20,
  	"UserName": "admin",
  	"FirstName": "FirstName",
  	"LastName": "LastName",
  	"DisplayName": "DisplayName",
  	"Salt": "3y9VYg==",
  	"PasswordHash": "ZIG4jS2uJztiPhE9/e58h8XZuwNDsntauhZKAXb7WHY=",
  	"DigestHA1Hash": "08720bd6805d2ca0a6dbff734e580751",
  	"Roles": [
      "admin"
  	],
  	"Permissions": [
      "ThePermission"
  	],
  	"CreatedDate": "/Date(1376987208140)/",
  	"ModifiedDate": "/Date(1376987208140)/",
  	"Meta": {
  		"Active": "True"
  	}
  },
  {
  	"Id": 21,
  	"UserName": "TestUser",
  	"Salt": "G6a/SA==",
  	"PasswordHash": "0QarJJuPEOm1oZk/CHcdHZF+/Ex0OqStQ/VuoxKTubM=",
  	"DigestHA1Hash": "d3765baf04721ae19f74d45bf558a3c7",
  	"Roles": [
      "admin"
  	],
  	"Permissions": [

  	],
  	"CreatedDate": "/Date(1376987269982)/",
  	"ModifiedDate": "/Date(1376987269982)/",
  	"Meta": {
  		"Active": "True"
  	}
  },
  {
  	"Id": 22,
  	"UserName": "Testuser2",
  	"Salt": "FjakiA==",
  	"PasswordHash": "U7ZOWON12TmUlHbs2i5gI4qH4eSdFFvJoAFs6Hqzwaw=",
  	"DigestHA1Hash": "d2b8fd567e079bff760f727d1002fade",
  	"Roles": [
      "user"
  	],
  	"Permissions": [

  	],
  	"CreatedDate": "/Date(1376989632541)/",
  	"ModifiedDate": "/Date(1377176731820)/",
  	"Meta": {
  		"Active": "False"
  	}
  },
  {
  	"Id": 23,
  	"UserName": "Fred",
  	"Salt": "1r69Ug==",
  	"PasswordHash": "07cTkSQ9zA9KE1CvNrx9CsCPJK5xbS3qZugLV92zrUI=",
  	"DigestHA1Hash": "717451dac142fcf4235582843950ba23",
  	"Roles": [
      "Admin"
  	],
  	"Permissions": [

  	],
  	"CreatedDate": "/Date(1376990565180)/",
  	"ModifiedDate": "/Date(1376990565180)/",
  	"Meta": {
  		"Active": "False"
  	}
  },
  {
  	"Id": 64,
  	"UserName": "TheYeti",
  	"Salt": "jcJuIw==",
  	"PasswordHash": "PXPH84r1uYA7EcoKTHJHjx7LyZ9/dLzZlDCL/Wl4+SQ=",
  	"DigestHA1Hash": "b2aadfd70b5a3e98972d630a1226f22f",
  	"Roles": [
      "Admin"
  	],
  	"Permissions": [

  	],
  	"CreatedDate": "/Date(1377007407711)/",
  	"ModifiedDate": "/Date(1377007407711)/",
  	"Meta": {
  		"Active": "True"
  	}
  }
		]
	});