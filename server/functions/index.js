// Set REGION to match your Firestore location:
// nam5 (United States) -> 'us-central1'   eur3 (Europe) -> 'europe-west1'
// any single region (e.g. 'southamerica-east1') -> that same name
const REGION = 'us-central1';

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
setGlobalOptions({ region: REGION, maxInstances: 5 });

const APP = 'https://mitoslab.github.io/Familee/';
const ICON = APP + 'icon-512.png';
const DEAD = ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'];

exports.pushNotification = onDocumentCreated('families/{fid}/items/{iid}', async (event) => {
  const n = event.data && event.data.data();
  if (!n || n.kind !== 'notifs') return;
  const db = admin.firestore();
  const fam = (await db.doc(`families/${event.params.fid}`).get()).data();
  const member = fam && fam.members && fam.members[n.to];
  if (!member || !member.uid) return;
  const userRef = db.doc(`users/${member.uid}`);
  const tokens = ((await userRef.get()).data() || {}).tokens || [];
  if (!tokens.length) return;
  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    webpush: {
      notification: { title: fam.name || 'Familee', body: n.text, icon: ICON },
      fcmOptions: { link: APP },
    },
  });
  const bad = tokens.filter((t, i) => !res.responses[i].success && DEAD.includes(res.responses[i].error && res.responses[i].error.code));
  if (bad.length) await userRef.update({ tokens: admin.firestore.FieldValue.arrayRemove(...bad) });
});
