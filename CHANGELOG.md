# v2.0.0

## Enhancements
- [#3] Show release notes journal entries when a new world/version is first loaded
- [#7] Add default item and actor icons and tokens

## Chores
- [#2] Migrate to new home and build process

**NOTE:** There have been major changes to the data structure used between the quickstart supporting early release on GitHub and this new release though the FoundryVTT package database.  There is no migration path between these versions, so this means you should not attempt to upgrade an old world, and should start fresh with this release.

Going forward any future required schema changes will have full data migration support.

---

# v1.1.2
- Add weapon info to attack rolls. For PCs, weapon rolls will correctly default to Might+Fight or Quickness+Fight in the prompt if the roll is Melee or Ranged, respectively.

---

# v1.1.1
- Add roll button for NPC sheets' Default attribute & skill.

---

# v1.1.0
- First release for Starter Set release series.

---

# v1.0.4
- Final version with QuickStart support.
- Fixed a typo preventing the Major NPC data model from actually being used.

---

# v1.0.3
- Roboto Flex font should be selectable in ProseMirror editors.
- Added Traits box to player character sheets.

---

# v1.0.2
- Add item description, when present, in Equipment list on character sheet.
- Don't display tech level in Equipment list for items with TL0.
- Remove the tooltip entirely from non-success/critical/complication dice faces.
- Add Macros compendium containing the dice prompt macro.

---

# v1.0.1
- Combat tracker added, thanks to Muttley!
- Fixed styling of "Current" box for Spirit

---

# v1.0
- Initial release! Have fun!
