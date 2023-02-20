const unknownLabelUnprocessed = 'unknown_contact_queue';
const unknownLabelProcessed = 'unknown_contact_processed';

let domainWhitelist = [
  'google.com'
];



function triggerScriptForEmail() {
  const threads = GmailApp.search('category:primary label:' + unknownLabelUnprocessed);
  const labelToRemove = GmailApp.getUserLabelByName(unknownLabelUnprocessed);
  const labelToAdd = GmailApp.getUserLabelByName(unknownLabelProcessed);

  
  // Primary threads
  for (const thread of threads) {
    const messages = thread.getMessages();
    let numberOfMessages = messages.length;
    if (numberOfMessages == 1){
      for (const message of messages) {
        let messageFromEmail = getEmailFromString(message.getFrom());
        console.log("Message from: " + messageFromEmail);
        let domainWhitelisted = domainWhitelist.some(v => messageFromEmail.includes(v));

        var resultsCount = 0;
        if(!domainWhitelisted){
          var contactSearchResults = People.People.searchContacts({
            "query": messageFromEmail,
            "readMask": "emailAddresses"
          });
          var resultsCount = Object.keys(contactSearchResults).length;
          console.log("Search results:" + contactSearchResults)
        }

        if(domainWhitelisted || resultsCount > 0){
          var matchedEmail = '';
          if(domainWhitelist.some(v => messageFromEmail.includes(v))){
            var matchedEmail = messageFromEmail;
          }else{
            var matchedEmail = contactSearchResults.results[0].person
          }
          console.log("Found! " + matchedEmail + "Removing Label:" + unknownLabelUnprocessed); 
          message.getThread().removeLabel(labelToRemove);
        }else{
          message.getThread().addLabel(labelToAdd);
          message.getThread().removeLabel(labelToRemove);
          console.log("no one found for "+ messageFromEmail +". Archiving & Adding label:"+unknownLabelProcessed+ " and removing label:" + unknownLabelUnprocessed);
          message.getThread().moveToArchive();
        }
      }
    }else{
      // Remove queue label
      for (const message of messages) {
        message.getThread().removeLabel(labelToRemove);
      }
      console.log("Skipping thread with count of "+ numberOfMessages);
    }

  }

  // NON Primary threads
  const nonPrimaryThreads = GmailApp.search('!category:primary label:' + unknownLabelUnprocessed);
  for (const nonPrimaryThread of nonPrimaryThreads) {
    const nonPrimaryMessages = nonPrimaryThread.getMessages();
    for (const nonPrimaryMessage of nonPrimaryMessages) {
      let messageFromEmail = getEmailFromString(nonPrimaryMessage.getFrom());
      console.log("Message from: " + messageFromEmail+ ". Removing label:" + unknownLabelUnprocessed);
      nonPrimaryMessage.getThread().removeLabel(labelToRemove);
    }
  }
}


function getEmailFromString(email){
  const regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
  return email.match(regex)[0]
}
