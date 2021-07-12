const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// ========================= //
// ======== STUDIES ======== //
// ========================= //
const createStudy = require("./studies/create-study");
const updateStudy = require("./studies/update-study");
const welcomeAccount = require("./studies/welcome-account");

exports.createStudy = functions.https.onCall(createStudy);
exports.updateStudy = functions.https.onCall(updateStudy);
exports.welcomeAccount = functions.https.onCall(welcomeAccount);

// =========================== //
// ======== TRIGGERED ======== //
// =========================== //
const onCreateResearcherAccount = require("./notifications/triggered/researcher-account/on-create-researcher-account");
const onUpdateResearcherAccount = require("./notifications/triggered/researcher-account/on-update-researcher-account");
const onDeleteResearcherAccount = require("./notifications/triggered/researcher-account/on-delete-researcher-account");

const onCreateParticipantAccount = require("./notifications/triggered/participant-account/on-create-participant-account");
const onUpdateParticipantAccount = require("./notifications/triggered/participant-account/on-update-participant-account");
const onDeleteParticipantAccount = require("./notifications/triggered/participant-account/on-delete-participant-account");

const onCreateStudy = require("./notifications/triggered/study/on-create-study");
const onUpdateStudy = require("./notifications/triggered/study/on-update-study");
const onDeleteStudy = require("./notifications/triggered/study/on-delete-study");

const onCreateReminder = require("./notifications/triggered/reminder/on-create-reminder");
const onUpdateReminder = require("./notifications/triggered/reminder/on-update-reminder");
const onDeleteReminder = require("./notifications/triggered/reminder/on-delete-reminder");

const onCreateMeeting = require("./notifications/triggered/meeting/on-create-meeting");
const onUpdateMeeting = require("./notifications/triggered/meeting/on-update-meeting");
const onDeleteMeeting = require("./notifications/triggered/meeting/on-delete-meeting");

const onNewParticipant = require("./notifications/triggered/study-participant/on-new-participant");

const researchersRef = functions.firestore.document("researchers/{researcherID}");
const participantsRef = functions.firestore.document("participants/{participantID}");
const studiesRef = functions.firestore.document("studies/{studyID}");
const remindersRef = functions.firestore.document("reminders/{reminderID}");
const meetingsRef = functions.firestore.document("meetings/{meetingID}");
const studyParticipantsRef = functions.firestore.document(
  "studies/{studyID}/participants/{participantID}"
);

exports.onCreateResearcherAccount = researchersRef.onCreate(onCreateResearcherAccount);
exports.onUpdateResearcherAccount = researchersRef.onUpdate(onUpdateResearcherAccount);
exports.onDeleteResearcherAccount = researchersRef.onDelete(onDeleteResearcherAccount);

exports.onCreateParticipantAccount = participantsRef.onCreate(onCreateParticipantAccount);
exports.onUpdateParticipantAccount = participantsRef.onUpdate(onUpdateParticipantAccount);
exports.onDeleteParticipantAccount = participantsRef.onDelete(onDeleteParticipantAccount);

exports.onCreateStudy = studiesRef.onCreate(onCreateStudy);
exports.onUpdateStudy = studiesRef.onUpdate(onUpdateStudy);
exports.onDeleteStudy = studiesRef.onDelete(onDeleteStudy);

exports.onCreateReminder = remindersRef.onCreate(onCreateReminder);
exports.onUpdateReminder = remindersRef.onUpdate(onUpdateReminder);
exports.onDeleteReminder = remindersRef.onDelete(onDeleteReminder);

exports.onCreateMeeting = meetingsRef.onCreate(onCreateMeeting);
exports.onUpdateMeeting = meetingsRef.onUpdate(onUpdateMeeting);
exports.onDeleteMeeting = meetingsRef.onDelete(onDeleteMeeting);

exports.onNewParticipant = studyParticipantsRef.onCreate(onNewParticipant);

// =========================== //
// ======== SCHEDULED ======== //
// =========================== //
const remindersRunner = require("./notifications/scheduled/reminders");
const meetingsRunner = require("./notifications/scheduled/meetings");

exports.notificationsRunner = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(() => Promise.allSettled([remindersRunner(), meetingsRunner()]));
