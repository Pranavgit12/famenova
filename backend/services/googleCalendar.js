const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function getAuth() {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2;
}

function getAuthUrl() {
  const oauth2 = getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

async function getTokensFromCode(code) {
  const oauth2 = getOAuth2Client();
  const { tokens } = await oauth2.getToken(code);
  return tokens;
}

async function getFreeSlots(dateStr, durationMin) {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const startOfDay = new Date(`${dateStr}T09:00:00`);
  const endOfDay = new Date(`${dateStr}T21:00:00`);

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      items: [{ id: process.env.GOOGLE_CALENDAR_ID || 'primary' }],
    },
  });

  const busy = data.calendars[process.env.GOOGLE_CALENDAR_ID || 'primary'].busy;

  const slots = [];
  const cursor = new Date(startOfDay);

  while (cursor.getTime() + durationMin * 60000 <= endOfDay.getTime()) {
    const slotEnd = new Date(cursor.getTime() + durationMin * 60000);

    const overlaps = busy.some(b => {
      const bStart = new Date(b.start);
      const bEnd = new Date(b.end);
      return cursor < bEnd && slotEnd > bStart;
    });

    if (!overlaps) {
      slots.push({
        start: cursor.toISOString(),
        end: slotEnd.toISOString(),
        label: formatTime(cursor),
      });
    }

    cursor.setTime(cursor.getTime() + 30 * 60000);
  }

  return slots;
}

async function createBooking({ start, end, name, email, type }) {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: `REX Agency — ${type}`,
    description: `Booked by: ${name}\nEmail: ${email}\nSession: ${type}`,
    start: { dateTime: start, timeZone: 'Asia/Kolkata' },
    end: { dateTime: end, timeZone: 'Asia/Kolkata' },
    attendees: email ? [{ email }] : [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
  };

  const { data } = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    requestBody: event,
    sendUpdates: email ? 'all' : 'none',
  });

  return { eventId: data.id, htmlLink: data.htmlLink };
}

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

module.exports = { getAuthUrl, getTokensFromCode, getFreeSlots, createBooking };
