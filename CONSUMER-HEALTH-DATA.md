# Consumer health data

Last changed 16 October 2026.

## 1. Who this is from, and what it covers

Tula Unified LLC makes Atüned, at 1634 West 39th Place, Los Angeles, California 90062, United States. Contact: hello@atuned.world.

This page is for people who live in Washington or Nevada. It is our consumer health data policy under Washington's My Health My Data Act and Nevada's consumer health data law. Consumer health data means information that can say something about a person's body or mind, now, before or later.

The [Privacy](privacy.html) page covers everything else.

## 2. What we collect, and why

Most of what you enter never reaches us. Your name, your birth details, your stories, your answers and your readings stay on your device.

This is what can reach us, or pass through our server:

| What | Why |
|---|---|
| The topic you pick on a first visit, such as anxiety, grief or pain | To join your first visit, and the free patterns that come with it, to your account if you make one |
| A mark when you finish the opening, finish your first release, or answer What changed. Never what you answered. | The same |
| Each line the voice speaks in a release. A line names one of your patterns. | To say the line out loud. Our server passes it to ElevenLabs and does not keep it. |
| What you write when you send a comment, a question or a report from Help, if it says something about your health | So our team can read it |

We use it for those reasons and nothing else. We do not use it to train any model.

## 3. Where it comes from

From you, and only from you. We buy none, and collect none from anyone else.

## 4. Who gets it

We do not sell consumer health data. We do not give it to any other company for its own use, and we have no affiliates.

These companies handle it for us, and only to run Atüned:

- **Cloudflare** runs our server, so everything above passes through it.
- **Supabase** holds the topic and the marks from your first visit.
- **ElevenLabs** gets each line the voice speaks, and nothing that names you.
- **Discord** holds what you send from Help, in a channel our team reads.

If you press Record to speak a story, your browser's maker turns the sound into text. Chrome sends it to Google and Edge sends it to Microsoft. We never get the sound.

## 5. Your choice

The opening says what it sends before you pick a topic. Picking a topic is your choice. Press Not now and no topic is sent. Turn Voice off in the release panel and no line goes to ElevenLabs.

## 6. Your rights

You may:

- ask whether we hold your consumer health data, and get a copy of it
- get the list of companies that got it. The list is in section 4.
- take back a yes you gave
- have it deleted

**Deleting.** Settings, Account, Delete this account deletes your first visit at Supabase along with the account. If you never made an account, your first visit sits under a random code and nothing that names you, so we cannot tell which one is yours.

## 7. How to use a right, and how to appeal

Write to hello@atuned.world. We may ask you to show the account is yours, so we never hand your data to someone else. We answer within 45 days. If we need longer, we tell you why, and take at most 45 days more.

If we say no, you may appeal. Write to hello@atuned.world and say you are appealing. We answer within 45 days and say why. If we still say no, you may take it to your state's Attorney General: in Washington at atg.wa.gov, and in Nevada at ag.nv.gov.

## 8. Location

We do not collect your location. We do not draw a line around any place where people get health care.

## 9. Changes and contact

When this page changes, the date at the top changes. Before we collect anything new, we change this page first.

Email: hello@atuned.world
Post: Tula Unified LLC, 1634 West 39th Place, Los Angeles, California 90062, United States

<!--
FOR THE OWNER AND FOR COUNSEL, NOT RENDERED. funnel/legal/render.py drops this
block. Rewritten 16 October against the code: the draft said stories, answers
and readings are collected at account creation, and profile sync is off (MOB
ui/auth.js PROFILE_SYNC_ENABLED false, Worker PROFILE_SYNC_ENABLED "0"), so
none of that reaches the server. What does reach it is the first visit topic,
which can name a mental health state. Open for counsel: whether the notice on
the first onboarding card is the consent Washington asks for, and whether
Connecticut or another state now needs naming.
-->
