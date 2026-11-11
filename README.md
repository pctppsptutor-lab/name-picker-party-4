# Name Picker Party 4

Six more classroom name-picker mini-games (19–24), on the same engine and look as Name Picker Party 1–3. Local only for now.

## How to run

From this folder run `python -m http.server 8768` and open http://localhost:8768/ in Chrome or Edge.

| Game | How it works | Twist |
|---|---|---|
| 19 Sock-Eating Washer | Everyone shows a pair of socks, one goes into the washer, the machine spits socks back out. | The first sock back is the right colour but wrong pattern; the lost sock shoots out of the sleeve to the real owner. |
| 20 Mystery Box Cats | Cats zoom around ten boxes, the bell rings and they dive in; the box that pops open picks the player. | The first box only holds a sock puppet; a laser dot zips to another box and the winning cat leaps out. |
| 21 Toilet Paper Mummy | A fan blows in three levels, unwrapping the mummies bit by bit. | The first mummy is just a costume broom; the toilet-roll mascot rolls over and pulls the winner's last strip. |
| 22 Off-Beat Disco Chickens | Watch the DJ chicken's routine, copy it on the beat, then freeze. | The spotlight finds a feathery mop doing it wrong; the music replays the last beat. |
| 23 Frog Lily Pad Jump | Frogs hop along rows of lily pads to the golden pad. | The first "golden pad" is a turtle shell that swims away; a dragonfly marks the real pad. |
| 24 Pirate Parcel Mix-Up | Foam cannonballs roll over barrels, a bridge, a bell and a wheel to open one of ten parcels. | The first parcel has a fake spring; the parrot spins the spare wheel and the real chain runs. |

About one round in four has no twist. The winner is always chosen the moment you press Pick.


## Sound effects

Game-specific MP3 effects load only for the selected game and use the existing Sound toggle and SFX volume. Credits and edit details are in `assets/sfx/credits.html` and `assets/sfx/sources.json`.

Run the dependency-free audio lifecycle checks with `node tests/sfx.test.cjs`.

Each game streams its own Kevin MacLeod BGM from `assets/bgm/` after a user gesture. Music credits and CC BY 4.0 sources are in `assets/bgm/credits.html`. Short action/result jingles retain VCSL samples; foreground effects briefly lower the music.
