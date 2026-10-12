// Copyright 2025 Poiema Ministries. All Rights Reserved.

import 'server-only';
import { google, sheets_v4 } from 'googleapis';
import {
  getGooglePrivateKey,
  getGoogleServiceAccountEmail,
} from '@/app/common/utils/env';
import { getServerSanityClient } from '@/sanity/lib/serverClient';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

function getAuth() {
  return new google.auth.JWT({
    email: getGoogleServiceAccountEmail(),
    key: getGooglePrivateKey(),
    scopes: SCOPES,
  });
}

function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

function getDriveClient() {
  return google.drive({ version: 'v3', auth: getAuth() });
}

function sheetUrl(spreadsheetId: string) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
}

async function moveToFolder(fileId: string, folderId: string) {
  const drive = getDriveClient();
  const meta = await drive.files.get({
    fileId,
    fields: 'parents',
    supportsAllDrives: true,
  });
  const previousParents = meta.data.parents?.join(',') ?? undefined;

  await drive.files.update({
    fileId,
    addParents: folderId,
    removeParents: previousParents,
    fields: 'id, parents',
    supportsAllDrives: true,
  });
}

async function shareWithEmail(fileId: string, email: string) {
  const drive = getDriveClient();
  await drive.permissions.create({
    fileId,
    sendNotificationEmail: false,
    supportsAllDrives: true,
    requestBody: {
      type: 'user',
      role: 'writer',
      emailAddress: email,
    },
  });
}

async function formatAsTable(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetId: number,
  columnCount: number,
) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: columnCount,
            },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
              },
            },
            fields: 'userEnteredFormat.textFormat.bold',
          },
        },
      ],
    },
  });
}

async function createRegistrationSheet(params: {
  eventTitle: string;
  headers: string[];
}): Promise<{ spreadsheetId: string; url: string }> {
  const sheets = getSheetsClient();
  const title = `Poiema Ministries - ${params.eventTitle}`;

  const created = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Registrations',
            gridProperties: {
              frozenRowCount: 1,
              rowCount: 1000,
              columnCount: Math.max(params.headers.length, 26),
            },
          },
        },
      ],
    },
    fields: 'spreadsheetId,sheets.properties.sheetId',
  });

  const spreadsheetId = created.data.spreadsheetId;
  if (!spreadsheetId) {
    throw new Error('Google Sheets create did not return a spreadsheet ID');
  }

  const tabSheetId = created.data.sheets?.[0]?.properties?.sheetId ?? 0;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Registrations!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [params.headers] },
  });

  await formatAsTable(sheets, spreadsheetId, tabSheetId, params.headers.length);

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (folderId) {
    await moveToFolder(spreadsheetId, folderId);
  }

  const shareEmail = process.env.GOOGLE_SHEETS_SHARE_EMAIL;
  if (shareEmail) {
    await shareWithEmail(spreadsheetId, shareEmail);
  }

  return { spreadsheetId, url: sheetUrl(spreadsheetId) };
}

async function persistSheetOnEvent(
  eventId: string,
  spreadsheetId: string,
  url: string,
) {
  const sanity = getServerSanityClient();
  await sanity
    .patch(eventId)
    .setIfMissing({
      googleSheetId: spreadsheetId,
      googleSheetUrl: url,
    })
    .commit({ autoGenerateArrayKeys: false });
}

async function resolveWinningSheetId(
  eventId: string,
  createdSpreadsheetId: string,
): Promise<string> {
  const sanity = getServerSanityClient();
  const stored = await sanity.fetch<string | null>(
    `*[_type == "upcomingEvent" && _id == $eventId][0].googleSheetId`,
    { eventId },
  );

  if (stored && stored !== createdSpreadsheetId) {
    try {
      await getDriveClient().files.delete({
        fileId: createdSpreadsheetId,
        supportsAllDrives: true,
      });
    } catch (error) {
      console.error('Failed to delete orphaned Google Sheet:', error);
    }
    return stored;
  }

  return createdSpreadsheetId;
}

/**
 * Ensures the event has a registration spreadsheet, then appends one row.
 * Column order follows the Sanity field definitions; Submitted At is first.
 */
export async function appendEventRegistration(params: {
  eventId: string;
  eventTitle: string;
  googleSheetId?: string | null;
  fieldLabels: string[];
  fields: Record<string, string>;
}): Promise<{ spreadsheetId: string; created: boolean }> {
  const headers = ['Submitted At', ...params.fieldLabels];
  const row = [
    new Date().toISOString(),
    ...params.fieldLabels.map((label) => String(params.fields[label] ?? '')),
  ];

  let spreadsheetId = params.googleSheetId ?? null;
  let created = false;

  if (!spreadsheetId) {
    const sheet = await createRegistrationSheet({
      eventTitle: params.eventTitle,
      headers,
    });
    await persistSheetOnEvent(params.eventId, sheet.spreadsheetId, sheet.url);
    spreadsheetId = await resolveWinningSheetId(
      params.eventId,
      sheet.spreadsheetId,
    );
    created = spreadsheetId === sheet.spreadsheetId;
  }

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Registrations!A:A',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });

  return { spreadsheetId, created };
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY,
  );
}
