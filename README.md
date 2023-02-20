# gmail-filter
Filters unknown contacts from hitting inbox and goes direct to a label `unknown_contact_processed`. After a few weeks of running the script and adding contacts I actually want email from, `unknown_contact_processed` has become almost entirely spam which makes it very easy to clean out.


## How it works

- Every new email has `unknown_contact_queue` label for up to 1 minute or until the next time the script runs if you configure trigger to run less often.
- If the sender of the email is a contact, `unknown_contact_queue` is removed.
- If the sender of the email is *NOT* a contact `unknown_contact_queue` is removed and `unknown_contact_processed` is added.
- If there is more than one message in a thread, it will be skipped. The goal here is to limit false positives but as you start running, you'll see some spam is missed for the first few weeks because people are continuously emailing you.



## Installation

1. Create two labels in gmail of `unknown_contact_queue` and `unknown_contact_processed`
1. Create a filter that "doesn't have" a random set of characters like `hg8d9ahg78dg6f382h7ihkg` and have it apply the label `unknown_contact_queue`. This is the label our script will search and run its rules on so it must apply to every new message however you decide to build a filter.
1. Go to https://script.google.com/home and create a new project.
1. Click "Services" and add `Peopleapi` and leave at `v1` with identifier of `People`
1. Copy and paste the contents of Code.gs in this repo into the Google Apps Script editor under file name Code.gs
1. Click the Stopwatch on the left for "Triggers" and click "+ Add Trigger"
1. Select `triggerScriptForEmail` as the function to run. `Time-driven` as the event source, `Minutes Timer` and `Every minute`. Set the failure notification settings as you please, I prefer to `Notify me immediately`.




## Day to day usage

To *NEVER* have a new email go into the `unknown_contact_processed` label, just add the email as a contact. The easiest way to do this in gmail is to click the "User" icon in the right sidebar while you have the email open. The contacts sidebar slides open. Click the email you want to add as a contact (or check if they are a conact). If they are not a contact, you'll see a little icon in the top right with a "+" to add them as a contact. Once you do this, they'll never go into the `unknown_contact_processed` label again and always hit your inbox.

OR

add domains to the whitelist in Code.gs.
