# Development Roadmap - 4 highly important / 1 low prio

## Animations - 3
There's no niceness in the portal. Needs some animations.

## Maker - 2
A tool for anyone to create soaps permissionlessly and set up a soap dealer in a self-service way.

## Glow support - 1
Glow should be supported as well through whatever method in the browser.

## Blast Control - 4
Currently everything runs on BCN..., which is a huge security hazard to say the least.
Implement a system where BCN... is not needed anymore, or rarely
### Seperate Fee Payer - 4
Use a seperate fee payer than BCN...
### Different mint authority - 2/3
So that live server does not need BCN... keypair but can use the mint authority.
either one keypair for all (easier), or unique keypair mint authority for each (difficult).

## Token Creator - 3
A part of the portal where anybody can create soaps
and it directs them through until they get a soap dealer

## Observability - 3
Add logging (axiom) to frontend to monitor errors, vitals and app activity

## Dealer only works between specified time - 1
Creator can set when a dealer should be working, eg. from - to.

## Dealer can be turned on and off - 4
Creator must be able to turn on and off dealer.
This will most likely need stored in a db.

## Examiner & Gallery look beautiful
cus they look and feel like shit now lol no shade


# DONE
## Gallery - 4
See all the soaps you own in one place.
## Dealer - 4
A way of distributing soaps. Eg. a QR code or link that people get a soap with.
## Solflare support - 3
Solflare is implementing deeplinks into their application, and it will use the same API schema as Phantom's.
The portal should have the button ready to go live before Solflare's update.

## Guardrails against abuse - 4
Api, or minting. A user should only get one soap.