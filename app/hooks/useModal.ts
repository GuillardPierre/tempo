import { useState } from 'react';

import type { ModalType } from '../types/modal';

export const useModal = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState<ModalType>('menu');

	const openModal = (type: ModalType) => {
		setModalType(type);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	return {
		modalVisible,
		modalType,
		openModal,
		closeModal,
		setModalType,
		setModalVisible,
	};
};
