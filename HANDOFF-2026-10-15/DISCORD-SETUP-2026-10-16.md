# Discord setup, 16 October 2026

You asked for two things: feedback from the app reaching Discord, and more
Discord channels hooked up. This page says how to do your part, one step at a
time. It covers four channels in your "Wins" group:

| Channel | What lands there | Who sends it |
|---|---|---|
| #atuned-feedback | Comments, questions, "something broken" reports and ratings that people write in the app | The app, every time someone presses Send |
| #latest | One short card each time a new version of atuned.world goes live | GitHub, by itself, after each live update |
| #milestones | A card your team writes and you approve, about a milestone | GitHub, only when someone starts it by hand |
| #investors | A card your team writes and you approve, for investors | GitHub, only when someone starts it by hand. Never by itself |

Words used on this page:

- **Webhook**: a private web address that Discord makes for one channel.
  Anything sent to that address shows up as a message in that channel. Treat
  it like a password: anyone who has it can post in that channel.
- **GitHub secret**: a locked box on GitHub where you keep a password, such as
  a webhook. GitHub can use it but never shows it again, not even to you.
- **Deploy**: putting the newest version of the app onto atuned.world.

## Part 1. Make one webhook for each channel, in Discord

Do this four times, once for each channel in the table above.

1. Open the Discord app, or go to discord.com in your web browser and log in.
2. On the left, click your own server (the one with the "Wins" group).
3. Find the channel, for example #atuned-feedback. Point at its name and click
   the small gear that appears next to it. It says "Edit Channel".
4. On the left of the settings page, click **Integrations**.
5. Click **Webhooks**, then **New Webhook**.
6. A webhook appears with a made up name. Click it. Change the name to
   something you will recognise, like "Atuned feedback" or "Atuned latest".
7. Check that the **Channel** box under the name shows the right channel.
8. Click **Copy Webhook URL**. The address is now copied, as if you had
   pressed copy on it. It starts with `https://discord.com/api/webhooks/`.
9. Click **Save Changes** at the bottom.
10. Go straight to Part 2 and paste it, before you copy anything else.

If the address you copied starts with `https://discord.gg/`, that is an
invite link, not a webhook. It will not work here. Go back to step 8.

## Part 2. Put each webhook into GitHub as a secret

GitHub is a separate login from Discord. You need your GitHub account
(rebootos-sourcce) for this.

1. Open a new browser tab and go to github.com/rebootos-sourcce/MOB. Log in
   if it asks.
2. Near the top of the page, click **Settings** (the last tab, with a gear).
3. On the left, find **Secrets and variables** and click it. Then click
   **Actions** under it.
4. Click the green button **New repository secret**.
5. In **Name**, type the exact name from the table below. Capital letters and
   underscores, exactly as written.
6. In **Secret**, paste the webhook address you copied in Part 1.
7. Click **Add secret**.

| Channel | Secret name to type |
|---|---|
| #atuned-feedback | `DISCORD_FEEDBACK_WEBHOOK` |
| #latest | `DISCORD_WEBHOOK_LATEST` |
| #milestones | `DISCORD_WEBHOOK_MILESTONES` |
| #investors | `DISCORD_WEBHOOK_INVESTORS` |

Every kind of feedback (comment, question, something broken, rating, the
longer product feedback) goes to #atuned-feedback. There is one feedback
channel. Each card's title says which kind it is.

### Why the feedback one also works from GitHub

The app's feedback goes through a small program on atuned.world (the
"feedback relay"). The relay reads its webhook from Cloudflare, the company
that hosts atuned.world, not from GitHub. Until today that meant it could
only be set on Cloudflare's website.

Now, each time the app is deployed, GitHub copies `DISCORD_FEEDBACK_WEBHOOK`
across to Cloudflare for you. We checked this in the code of Cloudflare's own
tool (wrangler, version 4.151.1) before building it. Setting the value changes
only that one setting, and a deploy never wipes it.

- If you put it in GitHub, GitHub's copy wins at every deploy.
- If you leave it out of GitHub, whatever is already on Cloudflare stays as
  it is.

You do not need to log in to Cloudflare at all.

## Part 3. Make it take effect

The three GitHub channels (#latest, #milestones, #investors) work as soon as
the secret is saved and the change below is merged.

The feedback one needs one deploy after you save it, because that is when
GitHub copies it to Cloudflare. You can wait for the next update to the app,
which deploys by itself. Or you can start one now:

1. Go to github.com/rebootos-sourcce/MOB and click the **Actions** tab.
2. On the left, click **deploy**.
3. On the right, click **Run workflow**. Leave the branch as **main**. Leave
   the box called **rollback_ref** empty. An empty box means "deploy the
   newest version".
4. Click the green **Run workflow** button. It takes about half an hour.
   A green tick means it is live.

This only works once draft pull request 100 has been merged into main. Until
then, the copy step and the #latest card do not exist yet.

## Part 4. Test each one

### #atuned-feedback

1. Go to atuned.world/atuned.html in your web browser. It has to be this
   address: a copy of the app saved on your computer cannot send.
2. At the top of the app, click the small person icon. It says "Your profile
   and settings" when you point at it.
3. Click **Discord feedback**. A box called "Leave a comment" opens.
4. Type one line, for example "Testing the feedback pipe". Click **Send it**.
5. Watch the message line at the bottom of the screen.

What you should see in the app: **Sent. Thank you.**

What you should see in #atuned-feedback: a card from "Atuned feedback",
titled **Comment**. Your line is in a grey box, and below it are the build,
the day, the screen type (phone or computer) and the coherence band (low,
middle or high, which is the only thing about the reading that travels).

If the message line says something else, this is what it means:

| The message line says | What it means | What to do |
|---|---|---|
| Held on this device, not sent yet. Feedback is not switched on here yet. | The relay has no webhook | Do Part 2 for `DISCORD_FEEDBACK_WEBHOOK`, then Part 3 |
| ... Feedback is set up wrong on the server. | The saved value is not a webhook address (often an invite link) | Redo Parts 1 and 2 for the feedback channel |
| ... Discord refused it. | Discord said no. The webhook was probably deleted in Discord | Make a new webhook (Part 1) and replace the secret (Part 2) |
| ... Discord is busy, try again in a minute. | Discord asked us to slow down | Wait a minute. Press **Send now** on the Help page |
| ... Could not reach discord. / Discord did not answer in time. | Discord did not answer | Try again later with **Send now** on the Help page |
| ... The server does not take these yet. | The relay itself is not on atuned.world | Tell the team: the deploy did not include it |
| This copy is opened from a file ... | You are using a saved copy, not atuned.world | Use the address in step 1 |
| There is nothing in it to send yet. | The box was empty | Type something first |

Whenever it says "Held on this device", nothing is lost. The words wait in the
app, and the Help page has a **Send now** button to try again.

### #latest

After the next deploy (Part 3) finishes green, a card titled **Live on
atuned.world** appears in #latest. It shows the first line of the change, a
short code for that version, the build stamp (the version label the app
shows on its Help page), and a link to the GitHub run. If the secret is
missing or Discord is down, the deploy still finishes. The run page says the
card was not posted.

### #milestones and #investors

These never post by themselves. Your team drafts the words, you approve them,
then someone does this:

1. Go to github.com/rebootos-sourcce/MOB and click the **Actions** tab.
2. On the left, click **discord post**.
3. Click **Run workflow**. Leave the branch as **main**.
4. In **channel**, choose **milestones** or **investors**.
5. In **message**, paste the approved text, up to 1800 characters.
6. Click the green **Run workflow** button.

A green tick means Discord took it. The card shows the title "Milestone" or
"Investor update", the text, and the line "posted by hand from GitHub
Actions". A red cross means nothing was posted, and the run page says why
(secret missing, wrong address, message empty or too long, Discord said no).
Typing @everyone in the text prints it but does not ping anyone.

Milestones worth posting, once real people are counted. The "clean date" is
16 October 00:30 UTC, the moment from which test visits stopped being
counted with real ones:

- the first real visit after the clean date
- the first person to finish the tutorial (the opening walk through the app)
- the first release (a person letting one story go)
- the first account made
- the first paid month

The people counter (the KPI read) is a workflow you start by hand. It is
called "kpi totals" and lives on github.com/rebootos-sourcce/Reboot-OS under
Actions. Nothing watches it on its own, so milestone posts are by hand for
now: someone reads the counter, the team writes the card, you approve it, and
it goes out with the steps above.

## Part 5. The "Join our Discord" button

The app's menu has a **Join our Discord** row. It opens this invite:
`https://discord.gg/VRP8NApj2d`. That is the kind of link the app accepts (a
discord.gg invite), so the row shows.

An invite link can run out. Discord invites expire after seven days unless
whoever made them chose "never". If yours has expired, the button opens
Discord's "invite invalid" page, which is a dead button. To make one that
lasts:

1. In Discord, on your server, click the server name at the top left, then
   **Invite People**.
2. Click **Edit invite link** at the bottom.
3. Set **Expire After** to **Never** and click **Generate a New Link**.
4. Copy it and send it to the team. They put it into the app and rebuild.

The feedback probe below also asks Discord whether this invite is still alive.

## What the team checked, and what it could not

- A probe on GitHub asks atuned.world/feedback once and says plainly what the
  answer means. It is called **feedback probe**, under Actions, and it posts
  at most one test card that says "Engineering pipe test from the build
  team. Ignore this card."
- A fault was found and fixed: one Send on an empty box used to block every
  later comment on that device, even with Discord set up. Fixed in pull
  request 100.
- Nobody on the team can see your Discord or your Cloudflare settings, so
  whether each channel works is proven only by the tests in Part 4.
