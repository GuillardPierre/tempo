import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

interface PeriodSelection {
  week: { year: number; week: number };
  month: { year: number; month: number };
  year: { year: number };
}

type PeriodType = 'week' | 'month' | 'year';

// 🔹 Fonctions utilitaires
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
};

const getWeekStartDate = (year: number, week: number): Date => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay() + 1;
  return new Date(firstDayOfYear.getTime() + daysToAdd * 86400000);
};

const getCurrentSchoolYear = (): number => {
  const now = new Date();
  return now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
};

export const usePeriodSelection = () => {
  const now = new Date();
  const [currentType, setCurrentType] = useState<PeriodType>('week');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodSelection>({
    week: { year: now.getFullYear(), week: getWeekNumber(now) },
    month: { year: now.getFullYear(), month: now.getMonth() + 1 },
    year: { year: getCurrentSchoolYear() },
  });

  // 🔹 Navigation entre les périodes
  const navigatePeriod = useCallback(
    (direction: 'prev' | 'next') => {
      const step = direction === 'next' ? 1 : -1;

      setSelectedPeriod(prev => {
        if (currentType === 'week') {
          const newDate = getWeekStartDate(prev.week.year, prev.week.week);
          newDate.setDate(newDate.getDate() + step * 7);
          return {
            ...prev,
            week: { year: newDate.getFullYear(), week: getWeekNumber(newDate) },
          };
        }

        if (currentType === 'month') {
          const newDate = new Date(prev.month.year, prev.month.month - 1);
          newDate.setMonth(newDate.getMonth() + step);
          return {
            ...prev,
            month: { year: newDate.getFullYear(), month: newDate.getMonth() + 1 },
          };
        }

        return {
          ...prev,
          year: { year: prev.year.year + step },
        };
      });
    },
    [currentType]
  );

  // 🔹 Sélection manuelle
  const selectSpecificPeriod = useCallback(
    (type: PeriodType, value: any) => {
      setCurrentType(type);
      setSelectedPeriod(prev => ({ ...prev, [type]: value }));
    },
    []
  );

  // 🔹 Récupération de la plage de dates
  const getCurrentRange = useCallback(() => {
    if (currentType === 'week') {
      const start = getWeekStartDate(selectedPeriod.week.year, selectedPeriod.week.week);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return {
        from: dayjs(start).startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        to: dayjs(end).endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
      };
    }

    if (currentType === 'month') {
      const start = dayjs(`${selectedPeriod.month.year}-${String(selectedPeriod.month.month).padStart(2, '0')}-01`);
      return {
        from: start.startOf('month').format('YYYY-MM-DDTHH:mm:ss'),
        to: start.endOf('month').format('YYYY-MM-DDTHH:mm:ss'),
      };
    }

    // Année scolaire
    return {
      from: dayjs(`${selectedPeriod.year.year}-09-01`).startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
      to: dayjs(`${selectedPeriod.year.year + 1}-08-31`).endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    };
  }, [currentType, selectedPeriod]);

  // 🔹 Texte d'affichage
  const getPeriodDisplayText = useCallback(() => {
    if (currentType === 'week') {
      const start = getWeekStartDate(selectedPeriod.week.year, selectedPeriod.week.week);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return `Semaine ${selectedPeriod.week.week} (${start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })})`;
    }

    if (currentType === 'month') {
      return `${dayjs(new Date(selectedPeriod.month.year, selectedPeriod.month.month - 1)).format('MMMM YYYY')}`;
    }

    return `Année scolaire ${selectedPeriod.year.year}-${selectedPeriod.year.year + 1}`;
  }, [currentType, selectedPeriod]);

  // 🔹 Réinitialisation
  const resetToCurrentPeriod = useCallback(() => {
    const now = new Date();
    setSelectedPeriod({
      week: { year: now.getFullYear(), week: getWeekNumber(now) },
      month: { year: now.getFullYear(), month: now.getMonth() + 1 },
      year: { year: getCurrentSchoolYear() },
    });
  }, []);

  return {
    selectedPeriod,
    currentType,
    setCurrentType,
    navigatePeriod,
    selectSpecificPeriod,
    getCurrentRange,
    getPeriodDisplayText,
    resetToCurrentPeriod,
  };
};
