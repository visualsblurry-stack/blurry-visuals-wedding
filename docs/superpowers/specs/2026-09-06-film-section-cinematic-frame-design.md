# Film Section Secondary Frame Design

## Goal

Make every homepage film card immediately recognizable as a playable video while preserving the site's light editorial page background.

## Visual Treatment

- Keep the existing two-column desktop and one-column responsive film grid.
- Wrap each thumbnail and its metadata in a strong secondary gray-teal frame.
- Place the title and studio credit on a secondary gray-teal strip below the thumbnail.
- Use the deeper companion shade for the circular play control, with a white icon and outline.
- Add a small `Watch film` cue over the lower-left corner of the thumbnail.
- Add a restrained deeper gray-teal offset shadow for depth.
- On hover and keyboard focus, lift the card slightly, strengthen the shadow, and enlarge the play control without shifting surrounding layout.

## Behavior

The cards remain links to their current YouTube destinations and continue opening in a new tab. The visual treatment does not restore YouTube iframe playback or alter keyboard behavior.

## Responsive And Accessibility Requirements

- The frame and metadata remain readable in the existing single-column mobile layout.
- The play cue must have high contrast against every thumbnail.
- Focus-visible styling must remain clear around the complete card.
- Reduced-motion visitors must not receive card or play-control movement.

## Verification

- Add structural tests for the secondary frame, metadata strip, watch cue, play-control contrast, and hover/focus treatment.
- Run the complete Node test suite.
- Inspect the live homepage at desktop and narrow widths and confirm the film cards remain clickable and visually stable.
