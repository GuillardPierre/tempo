import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { httpGet } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';

export const useIndex = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'menu' | 'delete'>('menu');
  const [blockToDelete, setBlockToDelete] = useState<number | null>(null);
  const [timerIsOpen, setTimerIsOpen] = useState(false);
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [worktimes, setWorktimes] = useState<
    {
      category: {
        id: string;
        name: string;
      };
      startTime: string;
      endTime: string;
      duration: number;
    }[]
  >([]);

  const getCurrentDateTime = (): string => {
    return new Date().toISOString().slice(0, 16);
  };

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function checkConnection() {
      const value = await AsyncStorage.getItem('token');
      if (value) {
        setIsConnected(true);
        getWorktimes();
      } else {
        setIsConnected(false);
      }
    }
    checkConnection();
  }, []);

  // Nouvel useEffect pour déclencher getWorktimes à chaque changement de date
  useEffect(() => {
    if (isConnected) {
      getWorktimes();
    }
  }, [date]);

  const getWorktimes = async () => {
    try {
      const rep = await httpGet(`${ENDPOINTS.worktime.root}user/${date}`);
      console.log('rep:', rep);
      if (rep.ok) {
        const data = await rep.json();
        console.log('data:', data);
        setWorktimes(data);
      }
    } catch (error) {
      console.log('erreur:', error);
    }
  };

  return {
    worktimes,
    date,
    setDate,
    modalVisible,
    setModalVisible,
    modalType,
    setModalType,
    blockToDelete,
    setBlockToDelete,
    timerIsOpen,
    setTimerIsOpen,
    calendarIsOpen,
    setCalendarIsOpen,
    isConnected,
    setIsConnected,
    setWorktimes,
  };
};
