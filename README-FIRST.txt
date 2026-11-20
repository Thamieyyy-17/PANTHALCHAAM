PANTHALCHAAM — FIREBASE + ANDROID SOURCE PROJECT

THIS ZIP
- Existing React/Vite + Capacitor project, updated with the approved black-and-gold football logo and Android display name PANTHALCHAAM.
- Android app ID remains com.turfbook.app to match the existing Firebase Android registration.
- Firebase project: turfbook-966bc. Functions region: asia-south1.
- The GitHub Actions workflow builds a DEBUG APK and verifies that all source icons match and that Android resources contain the PANTHALCHAAM label.

START HERE
1. Extract this ZIP and upload its contents directly into the root of a new GitHub repository. Do not upload the ZIP as one nested file.
2. Keep the repository's default branch as main.
3. Open Actions and run “Build PANTHALCHAAM Android APK”.
4. Download the artifact “PANTHALCHAAM-debug-apk” after the run succeeds.

WHAT THE SOURCE IMPLEMENTS
- Guest booking with booking ID + random access code; no customer account is required.
- Firestore-backed turf/settings data and Cloud Functions for booking creation, transaction-based hourly slot locks, owner management, payment verification, and notifications.
- Each turf must offer separate 5s and 7s prices. At most one turf may offer Mini 7s, with a separate price.
- Owner ID/password accounts and owner-scoped dashboards.
- Google admin sign-in with Firestore admins/<UID> allow-list validation. There is no bootstrapAdmin function, bootstrap secret, or local PIN backdoor.
- UPI/QR workflow: customer submits a reference after approval; admin verifies it. Verification adds ₹50 to the assigned owner's in-app credit ledger exactly once. This is not an automatic payout or payment gateway.
- Admin controls for turfs, owners, assignments, payment settings, app branding, and Notice Board with optional image.
- FCM and Firestore notification records for active admins/owners across multiple registered devices, plus guest booking tokens; Android foreground sound/vibration and a custom notification channel are included in source.

MANDATORY FIREBASE SETUP BEFORE BUSINESS TESTS
- .env.production contains the known public web client config for the existing Firebase project so an Android build is not silently missing its Firebase app identifiers. VITE_FIREBASE_VAPID_KEY is blank; supply the Web Push VAPID public key only if browser push is needed.
- google-services.json currently has an empty oauth_client array. For Android Google login, add the app's real SHA-1/SHA-256 in Firebase Console, enable Google sign-in, download the updated google-services.json, and replace this file before building.
- Deploy Firestore rules/indexes and Cloud Functions to the correct project. Cloud Functions deployments require the Blaze billing plan; a parent/guardian should review billing and budgets first.
- Admin provisioning: sign in once using the intended Google account, copy its UID from Firebase Authentication, then create Firestore document admins/<UID> with active=true. Client-side writes to admins are denied.

DO NOT TREAT THIS AS A RELEASE-READY BUSINESS APP YET
- No Firebase deployment was performed in this environment.
- Package installation timed out here, so Vite and Gradle builds were not run locally. GitHub Actions must complete successfully.
- The target tablet has not been runtime-tested with this exact ZIP, so the earlier logo-then-close issue is not confirmed fixed.
- The workflow creates a debug APK only, not a signed release AAB.
- Custom notification delivery depends on deployed Cloud Functions, valid FCM setup, permissions, device settings, and real-device testing.
- App images currently use bounded data URLs in Firestore, not Firebase Storage. This is a small-scale limitation.
- Payment verification is manual. ₹50 is an in-app owner credit, not cash transfer.
- Test at least two devices for booking collisions, customer lookup, owner data isolation, Google admin access, payment verification, Notice Board sync, and push notification sound/vibration before accepting real bookings or payments.

For more details, see PROJECT-REQUIREMENTS-AND-STATUS.txt and FIREBASE-NEXT-STEPS.txt.
