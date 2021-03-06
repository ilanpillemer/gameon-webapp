'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
  .controller('PlayCtrl',
  [          '$state','$log','playerSocket','user','auth', 'map', 'userAndAuth','$window', 'marked',
    function ($state,  $log,  playerSocket,  user,  auth,   map,   userAndAuth,  $window,   marked) {
      $log.debug('Starting play controller with %o and %o for ', user, playerSocket, user.profile.id);

      var inputBox = $window.document.getElementById('inputbox');
      inputBox.focus();

      this.user = user;
      this.auth = auth;
      this.map  = map;
      this.userInput = '';
      this.roomEvents = playerSocket.roomEvents;
      this.clientState = playerSocket.clientState;
      this.fixKeyboard = "";

      this.pause = function() {
        $log.debug('PAUSE!!');
        playerSocket.pause('This session has been paused', true);
      };

      this.resume = function(id) {
        $log.debug('RESUME!! %o', id);
        playerSocket.resume(id);
      };

      this.restart = function() {
        this.sendFixed('/sos-restart');
        $state.go('play.room');
      };

      this.logout = function() {
        playerSocket.logout();
        $state.go('default');
      };

      this.updateProfile = function( ) {
          if ( this.profileForm.$invalid ) {
            // bogus form data: don't go yet without correcting
          } else {
            user.update();
            this.clientState.username = user.profile.name;
            $state.go('play.room');
          }
      };

      this.updateSharedSecret = function( ) {
        user.updateSharedSecret();
      };

      this.doorName = function(direction) {
          switch(direction) {
              case 'N': return '<span class="full">(N)orth</span><span class="short">N</span>';
              case 'S': return '<span class="full">(S)outh</span><span class="short">S</span>';
              case 'E': return '<span class="full">(E)ast</span><span class="short">E</span>';
              case 'W': return '<span class="full">(W)est</span><span class="short">W</span>';
              case 'U': return '<span class="full">(U)p</span><span class="short">U</span>';
              case 'D': return '<span class="full">(D)own</span><span class="short">D</span>';
              default: return '';
          }
      };

      this.input = function(e) {
        if (e.keyCode === 13) {
          this.send();
          inputBox.focus();
        }
      };

      this.inputFocus = function() {
        this.fixKeyboard = "phonekeyboard";
      };

      this.inputBlur = function() {
        this.fixKeyboard = "";
      };

      this.append = function(input) {
        this.userInput += ' ' + input;
        inputBox.focus();
      };

      this.fillin = function(input) {
        $log.debug('replace value of input box ', input);

        this.userInput = input;
        inputBox.focus();
      };

      this.listExits = function() {
        playerSocket.listExits();
      };

      this.listCommands = function() {
        playerSocket.listCommands();
      };

      this.send = function() {
        var input = this.userInput;
        this.userInput = '';
        if ( input ) {
          playerSocket.send(input);
          inputBox.focus();
        }
      };

      this.sendFixed = function(input) {
        playerSocket.send(input);
      };

      this.marked = function(input){
        return marked(input || '');
      };
  }]);
