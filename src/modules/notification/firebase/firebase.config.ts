import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FirebaseProvider: Provider = {
  provide: 'FIREBASE_ADMIN',

  useFactory: () => {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_JSON as string);

    firebaseConfig.private_key = firebaseConfig.private_key.replace(
      /\\n/g,
      '\n',
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
    }

    return admin;
  },
};
