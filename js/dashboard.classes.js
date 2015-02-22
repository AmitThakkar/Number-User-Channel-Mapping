/**
 * Created by Amit Thakkar on 22/02/15.
 */
(function (win) {
  win.dashboard = {
    User: function (id, name) {
      this.id = id;
      this.name = name;
    },
    Channel: function (id, name, phoneNumber) {
      this.id = id;
      this.name = name;
      this.phoneNumber = phoneNumber;
    },
    Following: function (channelId, userId) {
      this.channelId = channelId;
      this.userId = userId;
    },
    PhoneNumber: function (number) {
      this.number = number;
    },
    Interest: function (name) {
      this.name = name;
    }
  }
})(window);
