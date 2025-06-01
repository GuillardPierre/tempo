import dayjs from 'dayjs';

// Début et fin de la semaine en cours (lundi à dimanche)
export function getCurrentWeekRange() {
  const now = dayjs();
  // dayjs().day() : 0 = dimanche, 1 = lundi, ..., 6 = samedi
  const dayOfWeek = now.day();
  // Décalage pour obtenir le lundi courant
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = now
    .add(diffToMonday, 'day')
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const endOfWeek = startOfWeek
    .add(6, 'day')
    .hour(23)
    .minute(59)
    .second(59)
    .millisecond(999);

  return {
    from: startOfWeek.format('YYYY-MM-DDTHH:mm:ss'),
    to: endOfWeek.format('YYYY-MM-DDTHH:mm:ss'),
  };
}

// Début et fin du mois en cours
export function getCurrentMonthRange() {
  const now = dayjs();
  const startOfMonth = now
    .startOf('month')
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const endOfMonth = now
    .endOf('month')
    .hour(23)
    .minute(59)
    .second(59)
    .millisecond(999);
  return {
    from: startOfMonth.format('YYYY-MM-DDTHH:mm:ss'),
    to: endOfMonth.format('YYYY-MM-DDTHH:mm:ss'),
  };
}

// Début et fin de l'année scolaire (1er septembre au 31 août)
export function getCurrentSchoolYearRange() {
  const now = dayjs();
  let startYear, endYear;
  if (now.month() + 1 >= 9) {
    startYear = now.year();
    endYear = now.year() + 1;
  } else {
    startYear = now.year() - 1;
    endYear = now.year();
  }
  const startOfSchoolYear = dayjs(`${startYear}-09-01T00:00:00`);
  const endOfSchoolYear = dayjs(`${endYear}-08-31T23:59:59`);
  return {
    from: startOfSchoolYear.format('YYYY-MM-DDTHH:mm:ss'),
    to: endOfSchoolYear.format('YYYY-MM-DDTHH:mm:ss'),
  };
}
