angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $state) {



  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

})


.controller('DashboardCrtl', function($scope) {
    var ctx = document.getElementById("myChart");
    var lambda = new AWS.Lambda();

    $scope.totalMessagesReceived = 321

    $scope.getAnalytics = function() {
      var params = {
        FunctionName: "getActions"
      };

      lambda.invoke(params, function(err, data) {
        if (err) console.log(err);
        else {
          var data = JSON.parse(data.Payload);
          var actionCounts = []
          var labelNames = []
          console.log(data.Actions);

          for (var i=0; i < data.Actions.length; i++) {
            actionCounts.push(data.Actions[i].InvocationCount);
            labelNames.push(data.Actions[i].Action);
          };

          $scope.$apply(function() {
            var data = {
              labels: labelNames,
              datasets: [
                  {
                      data: actionCounts,
                      backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#7e4fbc ",
                          "#1a20dd ",
                          "#f118df ",
                          "#286550 ",
                          "#ab86aa ",
                          "#3ecce3 ",
                          "#e1223f ",
                          "#3ea423 "
                      ],
                      hoverBackgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#7e4fbc ",
                          "#1a20dd ",
                          "#f118df ",
                          "#286550 ",
                          "#ab86aa ",
                          "#3ecce3 ",
                          "#e1223f ",
                          "#3ea423 "
                      ]
                }]
            };

            var myPieChart = new Chart(ctx,{
                type: 'pie',
                data: data
            });
          });
        }
      });

      var params2 = {
        FunctionName: "getSarahAnalytics"
      };

      lambda.invoke(params2, function(err, data) {
        if (err) console.log(err);
        else {
          var data = JSON.parse(data.Payload);

          $scope.$apply(function() {
            $scope.survivors = data.MostActiveSurvivors;
            $scope.totalMessagesReceived = data.TotalMessages
          });
        };
      });
    };

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.getAnalytics();
  });

  $scope.doRefresh = function() {
    $scope.getAnalytics();
    $scope.$broadcast('scroll.refreshComplete');
  }
})

.controller('ReplyManagerCtrl', function($scope) {
  var lambda = new AWS.Lambda();

  $scope.selectedCommand = {
    Action: '',
    Response: '',
    notes: '',
    updated: '',
    visible: false
  }

  $scope.edit = function(command) {
    $scope.selectedCommand = command;
    $scope.selectedCommand.visible = true;
  }

  $scope.getActions = function() {
    var params = {
      FunctionName: "getActions"
    };

    lambda.invoke(params, function(err, data) {
      if (err) console.log(err);
      else {
        var data = JSON.parse(data.Payload);

        $scope.$apply(function() {
          $scope.actions = data.Actions;
          $scope.selectedCommand = actions[0];
        });
      };
    });
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.getActions();
  });
})



.controller('ReplyHistoryCtrl', function($scope) {

  var lambda = new AWS.Lambda();

  $scope.getMessages = function() {
    var params = {
      FunctionName: "getMessageLog"
    };

    lambda.invoke(params, function(err, data) {
      if (err) console.log(err);
      else {
        data = JSON.parse(data.Payload);

        $scope.$apply(function() {
          for (var i=0; i < data.Messages.length; i++) {
            var d = new Date(-data.Messages[i].Timestamp*1000)
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = d.getFullYear();
            var month = months[d.getMonth()];
            var date = d.getDate();
            var hour = d.getHours();
            var min = d.getMinutes();
            var sec = d.getSeconds();
            data.Messages[i].Timestamp = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
          };
          $scope.records = data.Messages;
        });
      };
    });
  };

  $scope.doRefresh = function() {
    $scope.getMessages();
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.getMessages();
  });
})

.controller('DonationManagerCtrl', function($scope, $ionicModal) {
  $scope.commands = [
    {title: 'General', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', notes: 'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.', updated: '23 Oct 2016'},

    {title: '#25Days4Her', description: 'This campaign starts on November 1st, leading up to November 25th which is International Day for the Elimination of Violence Against Women. 25 chapters of a story, telling the real life struggles of a survivor This can be set-up to post using Hootsuite. Campaign marketed on all social media (Facebook, Twitter). Can sign up for this campaign – 25 days of mobile texts = checks their phones often and easy to interact with charity. Sign up knowing that they will receive 25 texts that follow the journey of a survivor: The Subscription process: TEXT or sign up via FACEBOOK/TWITTER. appeals to all friends, wives, girlfriends, women, mothers, daughters, if you know someone who survived', notes: 'Campaign outcomes: Increase monthly donors', updated: '25 March 2016'},

    {title: 'Tea for Teens', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', notes: 'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.', updated: '14 Feb 2016'},

    {title: 'Capital Campaign Gala', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', notes: 'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.', updated: '21 Oct 2006'},

    {title: 'Shoppers Drug Mart', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', notes: 'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.', updated: '22 Mar 2016'},

    {title: '#GiftTheCode', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', notes: 'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.', updated: '24 Mar 2016'}];

  $scope.selectedCommand = $scope.commands[0];

  $scope.edit = function(command) {
    $scope.selectedCommand = command;
  };

  $ionicModal.fromTemplateUrl('templates/new-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('DonationSummaryCtrl', function($scope) {
  $scope.totalAmount = '14,664';

  $scope.campaigns = [
  {
    title: "General",
    number: "$9,453.41",
    description: "Lorem consequat fugiat quis qui mollit pariatur ea ullamco exercitation ullamco consequat id laborum quis adipisicing tempor elit do velit ad commodo anim elit reprehenderit sunt quis exercitation do Lorem ipsum in sunt consequat eu dolore tempor eiusmod voluptate ex sint ea anim dolore aliquip"
  },
  {
    title: "#25Days4Her",
    number: "$12,251.55",
    description: "commodo qui eu veniam nulla ullamco pariatur pariatur excepteur eiusmod duis reprehenderit ipsum mollit fugiat officia voluptate in ut consequat aute velit minim cupidatat est in reprehenderit ut sunt sunt commodo culpa tempor sit eiusmod occaecat ex magna non id velit laborum veniam occaecat nulla"
  },
  {
    title: "Tea for Teens",
    number: "$9,118.59",
    description: "et deserunt anim exercitation cillum ut aute esse labore consequat deserunt laboris mollit reprehenderit anim labore exercitation exercitation dolore ullamco ex officia amet dolor eu commodo officia officia commodo minim enim amet consectetur nisi esse dolor occaecat reprehenderit consequat irure dolor minim elit eu consectetur"
  },
  {
    title: "Capital Campaign Gala",
    number: "$9,807.75",
    description: "quis tempor do mollit culpa proident ex cillum culpa ad id exercitation ex Lorem laborum aute laboris in eu aliquip cillum exercitation proident labore occaecat laborum eu ea deserunt deserunt velit ex non non amet laboris consectetur deserunt nulla excepteur ut sunt cupidatat laborum nostrud"
  },
  {
    title: "Shoppers Drug Mart",
    number: "$12,156.42",
    description: "veniam id cupidatat irure sit anim est nostrud sunt nisi ipsum proident laborum magna culpa officia in et qui aute veniam sint eiusmod velit nisi cupidatat deserunt adipisicing qui et eu qui consectetur adipisicing sint ullamco velit duis in laboris cupidatat minim et labore ut"
  },
  {
    title: "#GiftTheCode",
    number: "$12,935.67",
    description: "est elit pariatur dolor est dolor aliqua exercitation deserunt ad velit ad tempor ex incididunt sunt mollit id duis laboris irure proident ullamco cillum eiusmod veniam occaecat reprehenderit excepteur velit do dolore eiusmod exercitation eiusmod laboris laborum quis labore id ex ipsum exercitation incididunt voluptate"
  }
];

  $scope.selectedCampaign = $scope.campaigns[0];

  $scope.edit = function(campaign) {
    $scope.selectedCampaign = campaign;
  };

  $scope.donations = [
  { date: "23 Oct 2016", amount: "$68.90" },
  { date: "23 Oct 2016", amount: "$82.98" },
  { date: "23 Oct 2016", amount: "$65.34" },
  { date: "23 Oct 2016", amount: "$51.98" },
  { date: "22 Oct 2016", amount: "$64.85" },
  { date: "22 Oct 2016", amount: "$73.01" },
  { date: "21 Oct 2016", amount: "$44.02" },
  { date: "21 Oct 2016", amount: "$71.15" },
  { date: "21 Oct 2016", amount: "$45.46" },
  { date: "18 Oct 2016", amount: "$69.08" }
]
});
