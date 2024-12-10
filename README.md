# Captain Sonar

Board game rules: https://cdn.1j1ju.com/medias/64/53/3c-captain-sonar-rulebook.pdf

Milestones:

~~1) Simple chat application. Node.js + Express + Socket.io~~

~~2) Server controls the state, client sends events to the server to change it.~~

~~3) Separate client and server into individual folders with separate `package.json` files.~~

~~4) Fully functioning movement + surfacing controls: movement leaves trace, surfacing erases it.~~

~~5) Place connecting players into one of two teams. Make communication between server and client team-aware.~~

~~6) Add partial implementation of the Engineer systems and UI. No separate player roles yet.~~

~~7) Connect movement with engineering systems: every time a move is attempted, you need to click on an engineering node before the sub actually moves. UI should somehow indicate that, but not enforce it yet.~~

~~8) Add partial implementation of the Weapons/Powers systems and UI. No separate player roles still.~~

~~9) Add player roles + a DEV MODE role that acts as every role at once.~~

~~10) Add radio operator UI and mechanics.~~

~~11) Add global chat.~~

~~12) Add a modal dialog component to handle abilities activation.~~

~~13) Implement mine and torpedo ability activation.~~

14) Implement sonar and drones ability actuvation.

Tech debt:

1) There are definitely possible race conditions, at least when receiving acks from engineer and first mate. Need to add mutex to deal with them. See https://www.nodejsdesignpatterns.com/blog/node-js-race-conditions/

2) How to handle a situation when the captain orders a move, but the first mate can't charge any systems because they are all already fully charged.

3) The "team" should definitely be its own object capable of handling adding and removing players.

4) The captain should have the ability to detonate mines.
