/**
 * Created by Amit Thakkar on 22/02/15.
 */
(function (ng, win) {
  var dashboardModule = ng.module("dashboard", []);
  dashboardModule.controller('MainController', [function () {
    var self = this;
    self.interests = angular.copy(win.interests);
    self.users = [];
    if (localStorage && localStorage.users) {
      self.users = JSON.parse(localStorage.users);
    }
    self.addNewUser = function () {
      self.userErrorMessage = '';
      if (!self.userName || self.userName.trim() === "") {
        self.userErrorMessage = "Please provide user name!";
        return;
      }
      self.users.push(new win.dashboard.User(UUID.genV1().toString(), self.userName));
      if (localStorage) {
        localStorage.users = JSON.stringify(self.users);
      }
      self.userName = '';
    };
    self.startFollowing = function () {
      self.errorMessages = {};
      if (!self.follower) {
        self.errorMessages.userFollowerErrorMessage = "Please select follower!";
        return;
      }
      if (!self.followerInterest) {
        self.errorMessages.userFollowerInterestErrorMessage = "Please select follower's interest!";
        return;
      }
      followInterest(self.follower, self.followerInterest);
    };

    // Storing all the followers with followers named key in interest key;
    self.interestAndFollowerAndNumbers = {};
    self.numbersAndSubscribers = {};
    if (localStorage && localStorage.interestAndFollowerAndNumbers) {
      self.interestAndFollowerAndNumbers = JSON.parse(localStorage.interestAndFollowerAndNumbers);
    }
    if (localStorage && localStorage.numbersAndSubscribers) {
      self.numbersAndSubscribers = JSON.parse(localStorage.numbersAndSubscribers);
    }
    var followInterest = function (follower, followerInterest) {
      var phoneNumber = new win.dashboard.PhoneNumber(9999999999);
      var shiftInterest;
      if (self.interestAndFollowerAndNumbers && self.interestAndFollowerAndNumbers[followerInterest.name]) {
        if (self.interestAndFollowerAndNumbers[followerInterest.name].followers[follower.name]) {
          self.errorMessages.startFollowingErrorMessage = follower.name + " is already following " + followerInterest.name;
          return
        }
        var interestFollowingNumberDetails = self.interestAndFollowerAndNumbers[followerInterest.name];
        angular.forEach(self.interestAndFollowerAndNumbers, function (value, key) {
          if (self.interestAndFollowerAndNumbers[key].followers[follower.name] &&
            self.interestAndFollowerAndNumbers[key].number === interestFollowingNumberDetails.number) {
            shiftInterest = interestFollowingNumberDetails.followers.length <= self.interestAndFollowerAndNumbers[key].followers.length ? followerInterest.name : key
          }
        });
        if (shiftInterest) {
          phoneNumber = new win.dashboard.PhoneNumber(--phoneNumber.number);
          while(self.numbersAndSubscribers[phoneNumber.number] && self.numbersAndSubscribers[phoneNumber.number][follower.name]) {
            phoneNumber = new win.dashboard.PhoneNumber(--phoneNumber.number);
          }
          //self.numbersAndSubscribers[phoneNumber.number] = self.numbersAndSubscribers[self.interestAndFollowerAndNumbers[shiftInterest].number];
          if(!self.numbersAndSubscribers[phoneNumber.number]) {
            self.numbersAndSubscribers[phoneNumber.number] = {};
          }
          angular.forEach(self.interestAndFollowerAndNumbers[shiftInterest].followers, function(shiftInterestFollowers) {
            self.numbersAndSubscribers[phoneNumber.number][shiftInterestFollowers.name] = shiftInterestFollowers.name;
            delete self.numbersAndSubscribers[self.interestAndFollowerAndNumbers[followerInterest.name].number][shiftInterestFollowers.name];
          });
          self.interestAndFollowerAndNumbers[shiftInterest].number = phoneNumber.number;

        }
        self.interestAndFollowerAndNumbers[followerInterest.name].followers[follower.name] = follower;
        phoneNumber = new win.dashboard.PhoneNumber(self.interestAndFollowerAndNumbers[followerInterest.name].number)
      } else {
        while(self.numbersAndSubscribers[phoneNumber.number] && self.numbersAndSubscribers[phoneNumber.number][follower.name]) {
          phoneNumber = new win.dashboard.PhoneNumber(--phoneNumber.number);
        }
        var followers = {};
        followers[follower.name] = follower;
        self.interestAndFollowerAndNumbers [followerInterest.name] = {
          followers: followers,
          number: phoneNumber.number
        };
      }
      if(!self.numbersAndSubscribers[phoneNumber.number]) {
        self.numbersAndSubscribers[phoneNumber.number] = {};
      }
      self.numbersAndSubscribers[phoneNumber.number][follower.name] = follower.name;
      if (localStorage) {
        localStorage.interestAndFollowerAndNumbers = JSON.stringify(self.interestAndFollowerAndNumbers);
        localStorage.numbersAndSubscribers = JSON.stringify(self.numbersAndSubscribers);
      }
    };
  }]);
})(angular, window);
