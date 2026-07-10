# Flight Card — User Notes

Your leg, on one card. Paste the MiCrew release once before the flight; Flight Card turns it into a glance-readable reference card that works completely offline — including airplane mode.

> **Reference aid only.** Everything on the card comes from the text you paste. Verify against the AOM/FCOM/FOM/QRH and the release itself. Nothing leaves your iPad.

Open it here: **https://afherkdriver.github.io/flight-card/**

---

## First-time setup (once, on the ground with signal)

1. Open the link above in **Safari**.
2. Share button → **Add to Home Screen** → Add.
3. Launch from the icon from now on. After that first load it runs fully offline.

Updates take care of themselves: when a new version is out, a popup offers **Update now** next time you open it with signal.

---

## Loading a flight

1. Pull your flight plan in **MiCrew**; open the email it sends you.
2. Copy the **whole thing** — release, weather, crew list, addendum. No trimming needed.
3. Paste into Flight Card and hit **PARSE RELEASE → CARD**.
4. It asks for the few items not on the release — oxygen, ATIS, safe word, departure gate. Fill or skip; you can add them later.

New leg? **EDIT → PASTE** and go again. (There's a **Clear** button by the paste box.) The raw release text is discarded after parsing, and the card cleans itself off the device about two days after the flight.

---

## Reading the card

- **Top:** city pair, weights around the jet, ETE (tap it to flip to distance), gates both sides.
- **Pill under the header:** counts down to push, disappears once you're out — then reappears green with your **target landing window** about 40 minutes before it opens.
- **Middle:** nav on the left (SID/STAR/elevation/alternate), callsign with HEAVY when it applies, ATIS box, fuel on the right.
- **FAR 117 timer:** counts down to latest T/O — green, amber inside an hour, red inside 20 minutes.
- **Bottom:** MELs, safe word, pilots, and the FAs in cabin order behind the LD/PUR.

## The taps (most of the app is hidden here)

| Tap… | You get |
|---|---|
| ETE | flips to distance and back |
| PAX / arrival gate / oxygen | edit it right there |
| Safe word | show/hide · **double-tap** to edit |
| The red Delta ▲ | cycles the ATIS letter |
| Reserve fuel | delay fuel — amount, minutes, FL150/clean |
| Departure airport | dispatch METAR, matched to the current Zulu hour |
| Arrival airport | the full TAF, with your arrival period highlighted and decoded |
| Dispatcher phone (in DISPATCH) | copies it **with pauses + extension** — paste straight into the dialer |
| Any MEL chip | copies it |
| FAR 117 timer | marks **airborne** (green count-up) → tap again at the gate for **flight time** → tap again to reset |

DISPATCH · ROUTE · RPT PTS · REMARKS buttons open the detail popups; every popup has a COPY button.

## Flight attendants

The release fills the names. The A-position gets **LD** (domestic 757) or **PUR** (international, or any 767) automatically. Type cabin positions (2L, 3L, 4L…) into the blank position boxes on EDIT and the card lines everyone up in cabin order. Add a jumpseater with **+ F/A** and position **JMP** — they list last.

## Flight-time backup (off/on times)

Tap the FAR 117 timer to mark wheels-off manually, or turn on **Auto wheels-off (GPS+motion)** in Settings and let the iPad catch the roll and the touchdown itself (hard-mounted iPad, app on screen). Off/on times are correctable on the EDIT page under **Flight times (backup)** if the detection is off by a bit.

## Settings (the ⚙ gear, top right)

Day/Night/Auto theme · red night tint · DIM slider (darker than iOS minimum) · **In-flight mode** (hides the buttons, enlarges the card — exit via the small dim gear in the corner) · wake-lock status (should read **ACTIVE**; if it says TAP SCREEN, touch anywhere once) · **Clear all** wipes the card immediately.

---

*Questions, bugs, and ideas → Aaron. The build number lives under the ⚙ gear.*
