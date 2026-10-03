// Copyright 2026 Poiema Ministries. All Rights Reserved.

export class BibleStudyAuthError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'BibleStudyAuthError';
  }
}

export class BibleStudyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BibleStudyValidationError';
  }
}

export class BibleStudyCooldownError extends Error {
  constructor() {
    super(
      'A Bible Study email was just sent. Wait a minute before sending again.',
    );
    this.name = 'BibleStudyCooldownError';
  }
}

export class BibleStudyCapacityError extends Error {
  constructor() {
    super('Bible Study signup is full right now. Please try again later.');
    this.name = 'BibleStudyCapacityError';
  }
}
