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
  const [categories, setCategories] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  console.log('CATEGORIES', categories);

  useEffect(() => {
    checkConnection();
    getCategrories();
  }, []);

  // Nouvel useEffect pour déclencher getWorktimes à chaque changement de date
  useEffect(() => {
    if (isConnected) {
      getWorktimes();
    }
  }, [date]);

  async function checkConnection() {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      setIsConnected(true);
      getWorktimes();
    } else {
      setIsConnected(false);
    }
  }

  const getWorktimes = async () => {
    try {
      const rep = await httpGet(`${ENDPOINTS.worktime.root}user/${date}`);
      console.log('rep:', rep);
      if (rep.ok) {
        const data = await rep.json();
        setWorktimes(data);
      }
    } catch (error) {
      console.log('erreur:', error);
    }
  };

  const getCategrories = async () => {
    try {
      const rep = await httpGet(`${ENDPOINTS.category.root}`);
      if (rep.ok) {
        const data = await rep.json();
        setCategories(data);
      }
    } catch (error) {
      console.log('erreur:', error);
    }
  };

  return {
    worktimes,
    categories,
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
    setCategories,
  };
};
