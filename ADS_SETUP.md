# Turn on revenue ads

The ad integration is complete, but Google will not serve paid ads until the site and AdSense account are approved.

1. Publish Pixel Perfect on its final public domain.
2. Add that domain under **AdSense → Sites** and request review.
3. Copy the `ca-pub-…` client ID into `publisherId` in `ads-config.js`.
4. Create three responsive **Display** ad units in AdSense. Paste their numeric slot IDs into `homeBanner`, `toolBanner`, and `toolFooter` in `ads-config.js`.
5. Copy `ads.txt.example` to `ads.txt`, replace the placeholder with the `pub-…` publisher ID, and deploy it at the domain root.
6. In **AdSense → Privacy & messaging**, enable Google's certified consent management platform for visitors in the EEA, UK, and Switzerland.
7. Confirm `privacy.html` contains accurate information for the final site and operator.

Local previews show labeled ad placeholders. On a public domain, empty placements stay hidden until valid IDs are configured.

Never click your own ads or ask visitors to click them.
